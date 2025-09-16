resource "random_pet" "bucket_suffix" {
  length = 2
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = "${var.project_name}-${random_pet.bucket_suffix.id}"
  tags = {
    Name = "${var.project_name}-bucket"
  }
}

data "aws_iam_policy_document" "s3_policy_doc" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.s3_policy_doc.json
}
