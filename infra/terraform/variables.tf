variable "subscription_id" {
  description = "Azure subscription ID. Set ARM_SUBSCRIPTION_ID in the pipeline environment."
  type        = string
  default     = null
}

variable "location" {
  type    = string
  default = "eastus2"
}

variable "name_prefix" {
  description = "Lowercase alphanumeric prefix, 3-10 characters."
  type        = string
  default     = "voltsupply"

  validation {
    condition     = can(regex("^[a-z0-9]{3,10}$", var.name_prefix))
    error_message = "name_prefix must contain 3-10 lowercase letters or digits."
  }
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "resource_group_name" {
  description = "Dedicated resource group for this environment."
  type        = string
  default     = ""
}

variable "virtual_network_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

variable "aks_subnet_cidr" {
  type    = string
  default = "10.40.0.0/20"
}

variable "app_gateway_subnet_cidr" {
  type    = string
  default = "10.40.16.0/24"
}

variable "agent_subnet_cidr" {
  description = "Subnet for private, self-hosted Azure DevOps agents."
  type        = string
  default     = "10.40.32.0/24"
}

variable "service_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "dns_service_ip" {
  type    = string
  default = "10.0.0.10"
}

variable "availability_zones" {
  description = "AKS and public IP availability zones supported by the selected region."
  type        = list(string)
  default     = ["1", "2", "3"]
}

variable "aks_vm_size" {
  type    = string
  default = "Standard_D4s_v5"
}

variable "aks_min_node_count" {
  type    = number
  default = 3
}

variable "aks_max_node_count" {
  type    = number
  default = 10
}

variable "aks_admin_group_object_ids" {
  description = "Microsoft Entra group object IDs granted AKS RBAC Cluster Admin."
  type        = set(string)
}

variable "aks_deployment_principals" {
  description = "Azure DevOps workload identity object IDs and their pre-created deployment namespaces."
  type = list(object({
    object_id = string
    namespace = string
  }))
  default = []
}

variable "acr_push_principal_object_ids" {
  description = "Microsoft Entra service principal object IDs used by CI pipelines to push images to ACR."
  type        = set(string)
  default     = []
}

variable "log_retention_days" {
  type    = number
  default = 90
}