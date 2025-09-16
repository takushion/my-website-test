# .gitignoreに含まれている。
variable "aws_region" {
  description = "リソースを作成するAWSリージョン"
  type        = string
  default     = "ap-northeast-1" 
}

variable "project_name" {
  description = "リソースに付けるタグ用のプロジェクト名"
  type        = string
  default     = "my-website-project"
}

variable "github_username" {
  description = "GitHubのユーザー名"
  type        = string
}

variable "github_repo_name" {
  description = "GitHubのリポジトリ名"
  type        = string
}

variable "aws_profile" {
	description = "AWS CLIのプロファイル名 (AWS SSOでログインしたプロファイル)"
	type        = string
	default     = "terraform-sso-user"
}