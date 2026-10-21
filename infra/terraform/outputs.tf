output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "acr_name" {
  value = azurerm_container_registry.main.name
}

output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "application_gateway_public_ip" {
  value = azurerm_public_ip.application_gateway.ip_address
}

output "application_gateway_subnet_cidr" {
  value = var.app_gateway_subnet_cidr
}

output "private_agent_subnet_id" {
  value = azurerm_subnet.agents.id
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.main.id
}