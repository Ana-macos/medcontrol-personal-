output "website_url" {
  description = "URL do website hospedado no S3"
  value       = "http://${aws_s3_bucket.medcontrol_website.bucket}.s3-website-${var.aws_region}.amazonaws.com"
}

output "cloudfront_url" {
  description = "URL do CloudFront CDN"
  value       = "https://${aws_cloudfront_distribution.medcontrol_cdn.domain_name}"
}

output "api_gateway_url" {
  description = "URL do API Gateway para MCP Server"
  value       = "https://${aws_api_gateway_rest_api.mcp_api.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}

output "lambda_function_name" {
  description = "Nome da função Lambda MCP Server"
  value       = aws_lambda_function.mcp_server.function_name
}

output "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  value       = aws_dynamodb_table.medcontrol_data.name
}

output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.medcontrol_website.id
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront"
  value       = aws_cloudfront_distribution.medcontrol_cdn.id
}

output "estimated_monthly_cost" {
  description = "Estimativa de custo mensal (USD)"
  value = {
    s3_storage     = "~$0.50 (1GB)"
    cloudfront     = "~$1.00 (10GB transfer)"
    lambda         = "~$0.20 (1M requests)"
    dynamodb       = "~$1.25 (25 RCU/WCU)"
    api_gateway    = "~$3.50 (1M requests)"
    total_estimate = "~$6.45/mês"
  }
}

output "deployment_commands" {
  description = "Comandos para deploy manual"
  value = {
    sync_files = "aws s3 sync . s3://${aws_s3_bucket.medcontrol_website.id} --exclude '*.tf' --exclude 'terraform/*' --exclude 'node_modules/*'"
    invalidate_cdn = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.medcontrol_cdn.id} --paths '/*'"
    update_lambda = "zip -r mcp-server.zip mcp-server/ && aws lambda update-function-code --function-name ${aws_lambda_function.mcp_server.function_name} --zip-file fileb://mcp-server.zip"
  }
}