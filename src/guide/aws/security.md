# セキュリティ

AWSのようなクラウドサービスを利用する場合、セキュリティの考え方や対策の仕方は、従来のオンプレミスとは大きく異なってきます。

クラウドでは、あらゆる操作をインターネットを介して行うので、「通信データの暗号化」や「厳格なIAM管理」など、多くのセキュリティ対策が必要になります。しかし、セキュリティ対策を厳密に行おうとすると、人材の確保や多くの作業工数を要求され、せっかくクラウドを利用する事によって得られたアジリティが損なわれてしまいます。

OrBITでは、クラウドを利用する際に最低限押さえておくべきセキュリティポリシーを定義すると共に、そのポリシーを逸脱しないように予防、もしくは逸脱を検出する「ガードレール」のような仕組みを提供します。

[[toc]]

## 利用するAWSサービス
OrBITでは、AWSアカウントをセキュアに保つため、以下のサービスを利用します。

- ***AWS Organizations***

    複数のAWSアカウントを組織として一元的に管理するサービスです。
    サービスコントロールポリシー(SCP)という機能により、組織内のすべてのアカウントに対して、アクセス権限の制限を掛けることが可能であり、ポリシーの逸脱を「予防」することができます。

    詳細は以下を参照してください。
    - [「AWS Organizationsユーザーガイド」](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_introduction.html)
    
    ::: tip NOTE
    *AWS Organizations*は、OrBITコアシステムにより管理されますので、プロジェクト側での利用料金は発生しません。
    :::

- ***AWS Config Rule***

    *AWS Config*のサブセットであり、AWSリソースの設定内容を評価し、ルールに準拠しているかを判別するサービスです。
    ルールに対する準拠状態を監視し、通知する事でポリシーの逸脱を「検出」することができます。

    詳細は以下を参照してください。
    - [「AWS Configルール ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config.html)
    - [「AWS Configルール 料金」](https://aws.amazon.com/jp/config/pricing/)

- ***Amazon CloudWatch Alarm***

    *Amazon CloudWatch*のサブセットであり、メトリクスの状態の変化に応じてアラームを上げるサービスです。
    ポリシーに関連するメトリクスに対して、アラームを作成・通知設定をする事でポリシーの逸脱を「検出」することができます。

    詳細は以下を参照してください。
    - [「Amazon CloudWatchアラーム ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
    - [「Amazon CloudWatchアラーム 料金」](https://aws.amazon.com/jp/cloudwatch/pricing/)

## セキュリティポリシーについて
OrBITでは、[CIS](/support/glossary/#cis-center-for-internet-security)が公開しているセキュリティ基準をベースに、いくつかの要件を追加したものをセキュリティポリシーとして定義しています。

また、払い出したAWSアカウントは、このセキュリティポリシーに準拠していますので、すぐにセキュリティの専門家が推奨するベストプラクティスに従った環境で開発を始めることができます。

CISが公開しているセキュリティ基準の原文については、以下を参照してください。
- [「CIS Amazon Web Services Foundations v1.2.0」](https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf)

::: tip NOTE
CISのセキュリティ基準は、AWSサービスの増加や知識の蓄積により、随時更新されるものです。OrBITでも本書の更新に即して、随時内容の精査と更新を行っていきます。
:::

## リファレンス
ここでは、セキュリティポリシーの各項目に関するリファレンスを示します。
<CodeDetail title="このポリシーを見る" code="test"/>


### 1. IAM
各AWSサービスやリソースへのアクセス権限、およびユーザーIDの適切な管理に関する項目です。

#### 1.1 ルートユーザが利用されていないこと <Badge text="必須" type="error"/>
*(original) Avoid the use of the "root" account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.1 | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/account-management#ルートユーザーの管理)ことで遵守されます。

#### 1.2 コンソールログイン用のパスワードが設定されたIAMユーザにMFAが有効化されていること<Badge text="必須" type="error"/>
*(original) Ensure multi-factor authentication (MFA) is enabled for all IAM users that have a console password*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.2 | 必須 | あり |

#### 1.11 パスワードの有効期限が90日以内であること <Badge text="任意" type="tip"/>
*(original) Ensure credentials unused for 90 days or greater are disabled*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.1 | 必須 | あり |

*(original) Ensure credentials unused for 90 days or greater are disabled*
*(original) Ensure access keys are rotated every 90 days or less*
*(original) Ensure IAM password policy requires at least one uppercase letter*
*(original) Ensure IAM password policy require at least one lowercase letter*
*(original) Ensure IAM password policy require at least one symbol*
*(original) Ensure IAM password policy require at least one number*
*(original)  Ensure IAM password policy requires minimum length of 14 or greater*
*(original) Ensure IAM password policy prevents password reuse*
*(original) Ensure IAM password policy expires passwords within 90 days or less*
*(original) Ensure no root account access key exists*
*(original) Ensure MFA is enabled for the "root" account*
*(original) Ensure hardware MFA is enabled for the "root" account*
*(original) Ensure security questions are registered in the AWS account*
*(original) Ensure IAM policies are attached only to groups or roles*
*(original) Maintain current contact details*
*(original) Ensure security contact information is registered*
*(original) Ensure IAM instance roles are used for AWS resource access from instances*
*(original) Ensure a support role has been created to manage incidents with AWS Support*
*(original) Do not setup access keys during initial user setup for all IAM users that have a console password*
*(original) Ensure IAM policies that allow full "*:*" administrative privileges are not created*

### 2. Logging
監査目的やインシデント解析に必要なログの記録に関する項目です。

*(original) Ensure CloudTrail is enabled in all regions*
*(original) Ensure CloudTrail log file validation is enabled*
*(original) Ensure the S3 bucket used to store CloudTrail logs is not publicly accessible*
*(original) Ensure CloudTrail trails are integrated with CloudWatch Logs*
*(original) Ensure AWS Config is enabled in all regions*
*(original) Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket*
*(original) Ensure CloudTrail logs are encrypted at rest using KMS CMKs*
*(original) Ensure rotation for customer created CMKs is enabled*
*(original) Ensure VPC flow logging is enabled in all VPCs*

### 3. Monitoring
脅威、およびポリシーからの逸脱を検知する仕組みとその通知に関する項目です。

*(original) Ensure a log metric filter and alarm exist for unauthorized API calls*
*(original) Ensure a log metric filter and alarm exist for Management Console sign-in without MFA*
*(original) Ensure a log metric filter and alarm exist for usage of "root" account*
*(original) Ensure a log metric filter and alarm exist for IAM policy changes*
*(original) Ensure a log metric filter and alarm exist for CloudTrail configuration changes*
*(original) Ensure a log metric filter and alarm exist for AWS Management Console authentication failures*
*(original) Ensure a log metric filter and alarm exist for disabling or scheduled deletion of customer created CMKs*
*(original) Ensure a log metric filter and alarm exist for S3 bucket policy changes*
*(original) Ensure a log metric filter and alarm exist for AWS Config configuration changes*
*(original) Ensure a log metric filter and alarm exist for security group changes*
*(original) Ensure a log metric filter and alarm exist for changes to Network Access Control Lists*
*(original) Ensure a log metric filter and alarm exist for changes to network gateways*
*(original) Ensure a log metric filter and alarm exist for route table changes*
*(original) Ensure a log metric filter and alarm exist for VPC changes*

### 4. Networking
ネットワークの構成、および通信ポートの公開範囲に関する項目です。

*(original) Ensure no security groups allow ingress from 0.0.0.0/0 to port 22*
*(original) Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389*
*(original) Ensure the default security group of every VPC restricts all traffic*
*(original) Ensure routing tables for VPC peering are "least access"*

## 「検出」のガードレール

以下の項目が検出されます。

| 検出項目      | 検出手段 |  |
| ------------ |:------------:| ------------:|
| foo          | bar          | baz          |
| qux          | quux         | corge        |
| grault       | garply       | waldo        |


### 検出時のエスカレーション

### 自身の環境で検出結果を受け取る設定
