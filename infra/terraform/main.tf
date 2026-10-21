locals {
  resource_group_name  = var.resource_group_name != "" ? var.resource_group_name : "rg-${var.name_prefix}-${var.environment}"
  cluster_name         = "aks-${var.name_prefix}-${var.environment}"
  virtual_network_name = "vnet-${var.name_prefix}-${var.environment}"
  common_tags = {
    application = "volt-store"
    environment = var.environment
    managed_by  = "terraform"
    repository  = "ecommerce-project"
  }
  deployment_principals = {
    for principal in var.aks_deployment_principals : "${principal.object_id}-${principal.namespace}" => principal
  }
}

resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

resource "random_id" "acr_suffix" {
  byte_length = 3
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-${var.name_prefix}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  tags                = local.common_tags
}

resource "azurerm_virtual_network" "main" {
  name                = local.virtual_network_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = [var.virtual_network_cidr]
  tags                = local.common_tags
}

resource "azurerm_subnet" "aks" {
  name                 = "snet-aks"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.aks_subnet_cidr]
}

resource "azurerm_subnet" "application_gateway" {
  name                 = "snet-appgw"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.app_gateway_subnet_cidr]
}

resource "azurerm_subnet" "private_endpoints" {
  name                 = "snet-private-endpoints"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.private_endpoint_subnet_cidr]
}

resource "azurerm_subnet" "agents" {
  name                 = "snet-devops-agents"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.agent_subnet_cidr]
  service_endpoints    = ["Microsoft.ContainerRegistry", "Microsoft.Storage"]
}

resource "azurerm_public_ip" "nat" {
  name                = "pip-${var.name_prefix}-${var.environment}-nat"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = var.availability_zones
  tags                = local.common_tags
}

resource "azurerm_nat_gateway" "main" {
  name                    = "nat-${var.name_prefix}-${var.environment}"
  location                = azurerm_resource_group.main.location
  resource_group_name     = azurerm_resource_group.main.name
  sku_name                = "Standard"
  idle_timeout_in_minutes = 10
  zones                   = var.availability_zones
  tags                    = local.common_tags
}

resource "azurerm_nat_gateway_public_ip_association" "main" {
  nat_gateway_id       = azurerm_nat_gateway.main.id
  public_ip_address_id = azurerm_public_ip.nat.id
}

resource "azurerm_subnet_nat_gateway_association" "aks" {
  subnet_id      = azurerm_subnet.aks.id
  nat_gateway_id = azurerm_nat_gateway.main.id
}

resource "azurerm_subnet_nat_gateway_association" "agents" {
  subnet_id      = azurerm_subnet.agents.id
  nat_gateway_id = azurerm_nat_gateway.main.id
}

resource "azurerm_container_registry" "main" {
  name                          = "${var.name_prefix}${random_id.acr_suffix.hex}"
  resource_group_name           = azurerm_resource_group.main.name
  location                      = azurerm_resource_group.main.location
  sku                           = "Premium"
  admin_enabled                 = false
  public_network_access_enabled = false
  tags                          = local.common_tags
}

resource "azurerm_private_dns_zone" "acr" {
  name                = "privatelink.azurecr.io"
  resource_group_name = azurerm_resource_group.main.name
  tags                = local.common_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "acr" {
  name                  = "acr-${var.environment}"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.acr.name
  virtual_network_id    = azurerm_virtual_network.main.id
  registration_enabled  = false
  tags                  = local.common_tags
}

resource "azurerm_private_endpoint" "acr" {
  name                = "pe-${var.name_prefix}-${var.environment}-acr"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.common_tags

  private_service_connection {
    name                           = "acr-private-link"
    private_connection_resource_id = azurerm_container_registry.main.id
    subresource_names              = ["registry"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "acr-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.acr.id]
  }
}

resource "azurerm_public_ip" "application_gateway" {
  name                = "pip-${var.name_prefix}-${var.environment}-appgw"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = var.availability_zones
  tags                = local.common_tags
}

resource "azurerm_web_application_firewall_policy" "main" {
  name                = "waf-${var.name_prefix}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tags                = local.common_tags

  policy_settings {
    enabled                     = true
    mode                        = "Prevention"
    request_body_check          = true
    max_request_body_size_in_kb = 128
    file_upload_limit_in_mb     = 100
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }
}

resource "azurerm_application_gateway" "main" {
  name                = "agw-${var.name_prefix}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  firewall_policy_id  = azurerm_web_application_firewall_policy.main.id
  zones               = var.availability_zones
  tags                = local.common_tags

  sku {
    name = "WAF_v2"
    tier = "WAF_v2"
  }

  autoscale_configuration {
    min_capacity = 2
    max_capacity = 10
  }

  gateway_ip_configuration {
    name      = "gateway-ip-configuration"
    subnet_id = azurerm_subnet.application_gateway.id
  }

  frontend_ip_configuration {
    name                 = "public-frontend"
    public_ip_address_id = azurerm_public_ip.application_gateway.id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  backend_address_pool {
    name = "agic-managed-backend"
  }

  backend_http_settings {
    name                  = "agic-managed-http-settings"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 30
  }

  http_listener {
    name                           = "agic-managed-listener"
    frontend_ip_configuration_name = "public-frontend"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "agic-managed-routing-rule"
    priority                   = 100
    rule_type                  = "Basic"
    http_listener_name         = "agic-managed-listener"
    backend_address_pool_name  = "agic-managed-backend"
    backend_http_settings_name = "agic-managed-http-settings"
  }

  depends_on = [azurerm_web_application_firewall_policy.main]
}

resource "azurerm_kubernetes_cluster" "main" {
  name                                = local.cluster_name
  location                            = azurerm_resource_group.main.location
  resource_group_name                 = azurerm_resource_group.main.name
  dns_prefix                          = "${var.name_prefix}-${var.environment}"
  kubernetes_version                  = null
  sku_tier                            = "Standard"
  private_cluster_enabled             = true
  private_cluster_public_fqdn_enabled = false
  private_dns_zone_id                 = "System"
  local_account_disabled              = true
  role_based_access_control_enabled   = true
  azure_policy_enabled                = true
  oidc_issuer_enabled                 = true
  workload_identity_enabled           = true
  automatic_channel_upgrade           = "patch"
  node_os_upgrade_channel             = "SecurityPatch"
  image_cleaner_enabled               = true
  image_cleaner_interval_hours        = 48
  tags                                = local.common_tags

  default_node_pool {
    name                         = "system"
    vm_size                      = var.aks_vm_size
    auto_scaling_enabled         = true
    min_count                    = var.aks_min_node_count
    max_count                    = var.aks_max_node_count
    vnet_subnet_id               = azurerm_subnet.aks.id
    zones                        = var.availability_zones
    os_sku                       = "Ubuntu"
    max_pods                     = 50
    only_critical_addons_enabled = true
    upgrade_settings {
      max_surge = "33%"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  azure_active_directory_role_based_access_control {
    azure_rbac_enabled     = true
    admin_group_object_ids = var.aks_admin_group_object_ids
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "userAssignedNATGateway"
    service_cidr      = var.service_cidr
    dns_service_ip    = var.dns_service_ip
  }

  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  }

  key_vault_secrets_provider {
    secret_rotation_enabled  = true
    secret_rotation_interval = "2m"
  }

  ingress_application_gateway {
    gateway_id = azurerm_application_gateway.main.id
  }

  depends_on = [azurerm_subnet_nat_gateway_association.aks]
}

resource "azurerm_kubernetes_cluster_node_pool" "application" {
  name                  = "apps"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = var.aks_application_vm_size
  mode                  = "User"
  auto_scaling_enabled  = true
  min_count             = var.aks_application_min_node_count
  max_count             = var.aks_application_max_node_count
  vnet_subnet_id        = azurerm_subnet.aks.id
  zones                 = var.availability_zones
  os_sku                = "Ubuntu"
  max_pods              = 50
  node_labels = {
    "workload" = "application"
  }
  upgrade_settings {
    max_surge = "33%"
  }
  tags = local.common_tags
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
}

resource "azurerm_role_assignment" "acr_push" {
  for_each             = var.acr_push_principal_object_ids
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPush"
  principal_id         = each.value
}

resource "azurerm_role_assignment" "application_gateway_network_contributor" {
  scope                = azurerm_subnet.application_gateway.id
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_kubernetes_cluster.main.ingress_application_gateway[0].ingress_application_gateway_identity[0].object_id
}

resource "azurerm_role_assignment" "aks_admin" {
  for_each             = var.aks_admin_group_object_ids
  scope                = azurerm_kubernetes_cluster.main.id
  role_definition_name = "Azure Kubernetes Service RBAC Cluster Admin"
  principal_id         = each.value
}

resource "azurerm_role_assignment" "pipeline_cluster_user" {
  for_each             = local.deployment_principals
  scope                = azurerm_kubernetes_cluster.main.id
  role_definition_name = "Azure Kubernetes Service Cluster User Role"
  principal_id         = each.value.object_id
}

resource "azurerm_role_assignment" "pipeline_namespace_writer" {
  for_each             = local.deployment_principals
  scope                = "${azurerm_kubernetes_cluster.main.id}/namespaces/${each.value.namespace}"
  role_definition_name = "Azure Kubernetes Service RBAC Writer"
  principal_id         = each.value.object_id
}

resource "azurerm_monitor_diagnostic_setting" "aks" {
  name                       = "aks-diagnostics"
  target_resource_id         = azurerm_kubernetes_cluster.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category_group = "allLogs"
  }

  enabled_metric {
    category = "AllMetrics"
  }
}