# .gitignoreに含まれている。
variable "aws_region" {
  description = "リソースを作成するAWSリージョン"
  type        = string
  default     = "ap-northeast-1" 
}

variable "project_name" {
  description = "リソースに付けるタグ用のプロジェクト名"
  type        = string
  default     = "MyWebsiteTest"
}