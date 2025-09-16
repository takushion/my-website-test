resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # 2025年9月時点での最新のthumbprint
	# openssl s_client -connect token.actions.githubusercontent.com:443 -servername token.actions.githubusercontent.com -showcerts < /dev/null 2>/dev/null | \
  # awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/ {print $0}' | \
  # openssl x509 -fingerprint -sha1 -noout -in /dev/stdin
  thumbprint_list = ["7560d6f40fa55195f740ee2b1b7c0b4836cbe103"]
}

data "aws_iam_policy_document" "github_actions_trust_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_username}/${var.github_repo_name}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_actions_deploy_role" {
  name               = "${var.project_name}-github-actions-role"
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust_policy.json
}

data "aws_iam_policy_document" "deploy_permissions" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket", "s3:DeleteObject"]
    resources = [aws_s3_bucket.website_bucket.arn, "${aws_s3_bucket.website_bucket.arn}/*"]
  }
  statement {
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.s3_distribution.arn]
  }
}

resource "aws_iam_policy" "github_actions_deploy_policy" {
  name   = "${var.project_name}-github-actions-policy"
  policy = data.aws_iam_policy_document.deploy_permissions.json
}

resource "aws_iam_role_policy_attachment" "attach_deploy_policy" {
  role       = aws_iam_role.github_actions_deploy_role.name
  policy_arn = aws_iam_policy.github_actions_deploy_policy.arn
}
