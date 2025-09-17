terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket para hospedagem estática
resource "aws_s3_bucket" "medcontrol_website" {
  bucket = "${var.project_name}-${var.environment}-website"
}

resource "aws_s3_bucket_website_configuration" "medcontrol_website" {
  bucket = aws_s3_bucket.medcontrol_website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "medcontrol_website" {
  bucket = aws_s3_bucket.medcontrol_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "medcontrol_website" {
  bucket = aws_s3_bucket.medcontrol_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.medcontrol_website.arn}/*"
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.medcontrol_website]
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "medcontrol_cdn" {
  origin {
    domain_name = aws_s3_bucket.medcontrol_website.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.medcontrol_website.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.medcontrol_website.id}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cdn"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Lambda Function para MCP Server
resource "aws_lambda_function" "mcp_server" {
  filename         = "mcp-server.zip"
  function_name    = "${var.project_name}-${var.environment}-mcp-server"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      NODE_ENV = var.environment
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-mcp-server"
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM Role para Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}

# DynamoDB para armazenamento de dados
resource "aws_dynamodb_table" "medcontrol_data" {
  name           = "${var.project_name}-${var.environment}-data"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "dataType"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "dataType"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-data"
    Environment = var.environment
    Project     = var.project_name
  }
}

# API Gateway para MCP Server
resource "aws_api_gateway_rest_api" "mcp_api" {
  name        = "${var.project_name}-${var.environment}-mcp-api"
  description = "API Gateway para MedControl MCP Server"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "mcp_resource" {
  rest_api_id = aws_api_gateway_rest_api.mcp_api.id
  parent_id   = aws_api_gateway_rest_api.mcp_api.root_resource_id
  path_part   = "mcp"
}

resource "aws_api_gateway_method" "mcp_method" {
  rest_api_id   = aws_api_gateway_rest_api.mcp_api.id
  resource_id   = aws_api_gateway_resource.mcp_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "mcp_integration" {
  rest_api_id = aws_api_gateway_rest_api.mcp_api.id
  resource_id = aws_api_gateway_resource.mcp_resource.id
  http_method = aws_api_gateway_method.mcp_method.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.mcp_server.invoke_arn
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mcp_server.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.mcp_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "mcp_deployment" {
  depends_on = [
    aws_api_gateway_method.mcp_method,
    aws_api_gateway_integration.mcp_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.mcp_api.id
  stage_name  = var.environment
}