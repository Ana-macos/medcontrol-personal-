variable "aws_region" {
  description = "Região AWS para deploy"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "medcontrol-personal"
}

variable "environment" {
  description = "Ambiente de deploy"
  type        = string
  default     = "prod"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser dev, staging ou prod."
  }
}

variable "domain_name" {
  description = "Nome do domínio personalizado (opcional)"
  type        = string
  default     = ""
}

variable "enable_logging" {
  description = "Habilitar logs detalhados"
  type        = bool
  default     = true
}

variable "lambda_memory_size" {
  description = "Memória para função Lambda (MB)"
  type        = number
  default     = 256
  
  validation {
    condition     = var.lambda_memory_size >= 128 && var.lambda_memory_size <= 3008
    error_message = "Lambda memory deve estar entre 128 e 3008 MB."
  }
}

variable "cloudfront_price_class" {
  description = "Classe de preço do CloudFront"
  type        = string
  default     = "PriceClass_100"
  
  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
    error_message = "Price class deve ser PriceClass_All, PriceClass_200 ou PriceClass_100."
  }
}

variable "tags" {
  description = "Tags padrão para recursos"
  type        = map(string)
  default = {
    Project     = "MedControl Personal"
    Environment = "prod"
    ManagedBy   = "Terraform"
    Owner       = "Ana-macos"
    Purpose     = "Q Developer Quest TDC 2025"
  }
}