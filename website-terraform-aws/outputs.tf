output "website_url" {
  description = "CloudFront経由でアクセスするウェブサイトのURL"
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}

output "s3_bucket_name" {
  description = "デプロイ先のS3バケット名 (GitHub Actionsで使用)"
  value       = aws_s3_bucket.website_bucket.id
}

output "cloudfront_distribution_id" {
  description = "デプロイ先のCloudFront ID (GitHub Actionsで使用)"
  value       = aws_cloudfront_distribution.s3_distribution.id
}