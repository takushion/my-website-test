terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # S3バケット名をユニークにするためにrandomプロバイダーを追加
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  required_version = ">= 1.2"
}

# AWSプロバイダーの共通設定
provider "aws" {
  region  = var.aws_region
  profile = "terraform-sso-user" # IAM Identity Centerで設定したプロファイル名
}
