---
layout: Raw
---

## Terraformからデプロイする
Terraformから本カタログをデプロイする際は、**aws_cloudformation_stack**のリソースを使用します。  
以下を参考にして、適切な設定をして下さい。  

```
resource "aws_cloudformation_stack" "user_management" {
  name         = "UserManagementStack"
  template_url = "https://s3.amazonaws.com/${var.region}.usermanagement.orbit-catalog.artifact/${var.release_version}/UserManagementCatalogTemplate.yml"  
	capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"]  
	parameters = {
    ProjectName             = var.project
    LogFilterLevel          = var.log_filter_level
    LogRetentionInDays      = var.log_retention
    UseDbType               = var.use_db_type
    RdsSecretARN            = var.RdsSecretARN
    DefaultUserName         = var.default_username
    DefaultUserEmailAddress = var.default_useremail
    Subnets                 = "${data.aws_subnet.prv-AZ-a.id},${data.aws_subnet.prv-AZ-b.id},${data.aws_subnet.prv-AZ-c.id}"
    SecurityGroups          = data.aws_security_groups.lambda_sg.ids[0]
  }
```
