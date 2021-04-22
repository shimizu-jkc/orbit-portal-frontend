# セキュリティ事故予防サービス

AWSのようなクラウドサービスを利用する場合、セキュリティの考え方や対策の仕方は、従来のオンプレミスとは大きく異なってきます。

クラウドでは、あらゆる操作をインターネットを介して行うので、「通信データの暗号化」や「厳格なIAM管理」など、多くのセキュリティ対策が必要になります。しかし、セキュリティ対策を厳密に行おうとすると、人材の確保や多くの作業工数を要求され、せっかくクラウドを利用する事によって得られたアジリティが損なわれてしまいます。

OrBITでは、クラウドを利用する際に最低限押さえておくべきセキュリティポリシーを定義すると共に、そのポリシーを逸脱しないように予防、もしくは逸脱を検出する「ガードレール」となる仕組みを提供します。

[[toc]]

## 利用するAWSサービス
OrBITでは、AWSアカウントをセキュアに保つため、以下のサービスを利用します。

- ***AWS Organizations***

    複数のAWSアカウントを組織として一元的に管理するサービスです。
    サービスコントロールポリシー(SCP)という機能により、組織内のすべてのアカウントに対して、アクセス権限の制限を掛けることが可能であり、ポリシーの逸脱を予防することができます。

    詳細は以下を参照してください。
    - [「AWS Organizationsユーザーガイド」](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_introduction.html)
    
    ::: tip INFO
    *AWS Organizations*は、OrBITコアにより管理されますので、プロジェクト側での利用料金は発生しません。
    :::

- ***AWS Config Rules***

    *AWS Config*のサブセットであり、AWSリソースの設定内容を評価し、ルールに準拠しているかを判別するサービスです。
    ルールに対する準拠状態を監視し、通知する事でポリシーの逸脱を検出することができます。

    詳細は以下を参照してください。
    - [「AWS Configルール ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config.html)
    - [「AWS Configルール 料金」](https://aws.amazon.com/jp/config/pricing/)

- ***Amazon CloudWatch Alarm***

    *Amazon CloudWatch*のサブセットであり、メトリクスの状態の変化に応じてアラームを上げるサービスです。
    ポリシーに関連するメトリクスに対して、アラームを作成・通知設定をする事でポリシーの逸脱を検出することができます。

    詳細は以下を参照してください。
    - [「Amazon CloudWatchアラーム ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
    - [「Amazon CloudWatchアラーム 料金」](https://aws.amazon.com/jp/cloudwatch/pricing/)

## セキュリティポリシーについて
OrBITでは、[CIS](/guide/common/glossary.html#cis-center-for-internet-security)が公開しているセキュリティ基準をベースに、いくつかの要件を追加したものをセキュリティポリシーとして定義しています。

また、AWSアカウントは、このセキュリティポリシーに準拠していますので、すぐにセキュリティの専門家が推奨するベストプラクティスに従った環境で開発を始めることができます。

CISが公開しているセキュリティ基準の原文については、以下を参照してください。
- [「CIS Amazon Web Services Foundations v1.3.0」](https://learn.cisecurity.org/l/799323/2020-08-10/2kdn5)

::: tip NOTE
CISのセキュリティ基準は、AWSサービスの増加や知識の蓄積により、随時更新されるものです。
OrBITでも本書の更新に即して、随時内容の精査と更新を行っていきます。
:::

## セキュリティポリシーの一覧
ここでは、セキュリティポリシーの各項目に関するリファレンスを示します。

### 1. IAM
各AWSサービスやリソースへのアクセス権限、およびユーザーIDの適切な管理に関する項目です。

#### 1.1 ルートユーザーが利用されていないこと <Badge text="必須" type="error"/>
*(original) Avoid the use of the "root" account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.1 | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.2 コンソールログイン用のパスワードが設定されたIAMユーザーのMFAが有効化されていること<Badge text="必須" type="error"/>
*(original) Ensure multi-factor authentication (MFA) is enabled for all IAM users that have a console password*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.2 | 必須 | あり |

この項目は、[2段階認証が有効化されたSSOを利用する](/guide/aws/service/id-management.html#_2段階認証)ことで遵守されます。

#### 1.3 90日以上利用されていない認証情報は無効化されていること<Badge text="必須" type="error"/>
*(original) Ensure credentials unused for 90 days or greater are disabled*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.3 | 必須 | 提供予定:warning: |

この項目は、[定期的なユーザーIDの棚卸作業](/guide/aws/service/id-management.html#ユーザーidの棚卸)をすることで遵守されます。
::: warning ATTENTION
ユーザーIDの棚卸作業以外にも、OrBITコアにより自動で無効化する仕組みを検討中です。
:::

#### 1.4 アクセスキーが90日以内にローテーションされていること <Badge text="必須" type="error"/>
*(original) Ensure access keys are rotated every 90 days or less*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.4 | 必須 | あり |

この項目は、OrBITベースラインの[「*AWS Config Rules*(access-keys-rotated)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/access-keys-rotated.html)で遵守されます。

#### 1.5 パスワードには1文字以上の大文字を含むこと <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy requires at least one uppercase letter*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.5 | 必須 | あり |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。

#### 1.6 パスワードには1文字以上の小文字を含むこと <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy require at least one lowercase letter*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.6 | 必須 | あり |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。

#### 1.7 パスワードには1文字以上の記号を含むこと <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy require at least one symbol*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.7 | 必須 | あり |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。

#### 1.8 パスワードには1文字以上の数字を含むこと <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy require at least one number*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.8 | 必須 | あり |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。

#### 1.9 パスワードは最低14文字以上であること <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy requires minimum length of 14 or greater*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.9 | 必須 | 提供予定:warning: |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。
:::warning ATTENTION
現在のパスワードポリシーでは、最低8文字以上の設定になっています。
:::

#### 1.10 パスワードを再利用しないこと <Badge text="必須" type="error"/>
*(original) Ensure IAM password policy prevents password reuse*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.10 | 必須 | 提供予定:warning: |

この項目は、[SSOにおけるパスワードポリシー](/guide/aws/service/id-management.html#パスワードポリシー)により遵守されます。
:::warning ATTENTION
現在のパスワードポリシーでは、再利用は可能になっています。
:::

#### 1.11 パスワードの有効期限が90日以内であること <Badge text="任意" type="tip"/>
*(original) Ensure IAM password policy expires passwords within 90 days or less*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.11 | 任意 | なし |

この項目は、OrBITでは提供されません。

#### 1.12 ルートユーザーのアクセスキーが設定されていないこと <Badge text="必須" type="error"/>
*(original) Ensure no root account access key exists*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.12 | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.13 ルートユーザーのMFAが有効化されていること <Badge text="必須" type="error"/>
*(original) Ensure MFA is enabled for the "root" account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.13 | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.14 ルートユーザーのハードウェアMFAが有効化されていること <Badge text="任意" type="tip"/>
*(original) Ensure hardware MFA is enabled for the "root" account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.14 | 任意 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.15 秘密の質問が設定されていること <Badge text="必須" type="error"/>
*(original) Ensure security questions are registered in the AWS account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.15 | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.16 IAMポリシーがグループまたはロールにのみ適用されていること <Badge text="必須" type="error"/>
*(original) Ensure IAM policies are attached only to groups or roles*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.16 | 必須 | 一部あり:warning: |

この項目は、[SSOを利用してAWSアカウントへログインする](/guide/aws/service/id-management.html#AWSアカウントへのアクセス手段)ことで遵守されます。
::: warning ATTENTION
AWSアカウントでは、任意のIAMユーザを作成する事が可能ですが、そのIAMユーザに付与されるIAMポリシーに関しては、現在、逸脱を検出する仕組みはありません。
:::

#### 1.17 連絡先が最新の状態に維持されていること <Badge text="必須" type="error"/>
*(original) Maintain current contact details*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.17 | 必須 | あり |

この項目は、[定期的なユーザーIDの棚卸作業](/guide/aws/service/id-management.html#ユーザーidの棚卸)をすることで遵守されます。
::: danger IMPORTANT
プロジェクトの連絡先に変更があった場合は、速やかに[問い合わせ窓口](/support/contact.html)までご連絡ください。
:::

#### 1.18 セキュリティ担当者の連絡先が登録されていること <Badge text="必須" type="error"/>
*(original) Ensure security contact information is registered*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.18 | 必須 | 提供予定:warning: |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。
::: warning ATTENTION
OrBITでは、AWSアカウントの払い出し申請の際に設定する、**セキュリティ管理者**の連絡先がセキュリティ連絡先にマッピングされます。現在、**セキュリティ管理者**は必須の役割としていないため、セキュリティ連絡先は未設定の場合があります。
:::

#### 1.19 EC2インスタンスからのAWSリソースアクセスにIAMロールが使用されていること <Badge text="推奨" type="warning"/>
*(original) Ensure IAM instance roles are used for AWS resource access from instances*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.19 | 推奨 | なし |

この項目は、OrBITではサポートされません。各プロジェクトにて遵守するよう心掛けてください。

#### 1.20 インシデント管理のため、AWSサポートへの権限が用意されていること <Badge text="必須" type="error"/>
*(original) Ensure a support role has been created to manage incidents with AWS Support*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.20 | 必須 | あり |

この項目は、[SSOによる適切なユーザとアクセス権限の管理](/guide/aws/service/id-management.html#役割とアクセス権限のマッピング)によって遵守されます。

#### 1.21  IAMユーザ作成時に不必要なアクセスキーが生成されていないこと <Badge text="必須" type="error"/>
*(original) Do not setup access keys during initial user setup for all IAM users that have a console password*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.21 | 必須 | 一部あり:warning: |

この項目は、[SSOを利用してAWSアカウントへログイン](/guide/aws/service/id-management.html#AWSアカウントへのアクセス手段)することで遵守されます。
::: warning ATTENTION
AWSアカウントでは、任意のIAMユーザを作成する事が可能ですが、そのIAMユーザ作成時に設定されるアクセスキーに関しては、現在、必要性を判断する仕組みはありません。
:::

#### 1.22 フルコントロール権限を持つポリシーが作成されていないこと <Badge text="必須" type="error"/>
*(original) Ensure IAM policies that allow full "*:*" administrative privileges are not created*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 1.22 | 必須 | 一部あり |

この項目は、[SSOによる適切なユーザとアクセス権限の管理](/guide/aws/service/id-management.html#役割とアクセス権限のマッピング)によって遵守されます。
::: warning ATTENTION
AWSアカウントでは、フルコントロール権限を持つIAMユーザーを作成する事が可能ですが、現在、それを抑制するような仕組みは提供していません。IAMユーザーの作成時には常に最小権限を意識してポリシーを付与することを推奨します。
:::

#### 1.23 MFAデバイス、もしくはMFAアプリケーションを含む端末を厳重に保管すること <Badge text="必須" type="error"/>
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| なし | なし | 必須 | あり |

この項目は、OrBITが[プロジェクトに代わってルートユーザーを管理する](/guide/aws/service/account-management.html#ルートユーザーの代替管理)ことで遵守されます。

#### 1.24 コンソールログイン用のIAMユーザーは個別に作成し、認証情報を共有しないこと <Badge text="必須" type="error"/>
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| なし | なし | 必須 | あり |

この項目は、[SSOによる適切なユーザとアクセス権限の管理](/guide/aws/service/id-management.html#役割とアクセス権限のマッピング)によって遵守されます。

#### 1.25 プロジェクトと無関係なユーザーは無効化すること <Badge text="必須" type="error"/>
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| なし | なし | 必須 | あり |

この項目は、[定期的なユーザーIDの棚卸作業](/guide/aws/service/id-management.html#ユーザーidの棚卸)をすることで遵守されます。
::: danger IMPORTANT
プロジェクトの連絡先に変更があった場合は、速やかに[問い合わせ窓口](/support/contact.html)までご連絡ください。
:::


### 2. Logging
監査目的やインシデント解析に必要なログの記録に関する項目です。

#### 2.1 全リージョンでCloudTrailが有効であること <Badge text="必須" type="error"/>
*(original) Ensure CloudTrail is enabled in all regions*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.1 | 必須 | 一部あり:warning: |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。
::: warning ATTENTION
現在、全リージョンではなくOrBITが[サポートするリージョン](/guide/aws/support-region.html)のみになります。
:::

#### 2.2 CloudTrailログファイルの検証が有効化されていること <Badge text="推奨" type="warning"/>
*(original) Ensure CloudTrail log file validation is enabled*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.2 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

#### 2.3 CloudTrailログの格納バケットが公開設定となっていないこと  <Badge text="必須" type="error"/>
*(original) Ensure the S3 bucket used to store CloudTrail logs is not publicly accessible*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.3 | 必須 | あり |

この項目は、OrBITコアが[CloudTrailログの収集](/guide/aws/service/audit.html#ログの収集)をし、[適切に管理](/guide/aws/service/audit.html#管理ポリシー)することで遵守されます。

#### 2.4 CloudTrailログがCloudWatch Logsに配信設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure CloudTrail trails are integrated with CloudWatch Logs*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.4 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

#### 2.5 全リージョンでAWS Configが有効であること <Badge text="必須" type="error"/>
*(original) Ensure AWS Config is enabled in all regions*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.5 | 必須 | 一部あり:warning: |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。
::: warning ATTENTION
現在、全リージョンではなくOrBITが[サポートするリージョン](/guide/aws/support-region.html)のみになります。
:::

#### 2.6 CloudTrailログの格納バケットのアクセスログ記録が有効化されていること <Badge text="必須" type="error"/>
*(original) Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.6 | 必須 | あり |

この項目は、OrBITコアが[CloudTrailログの収集](/guide/aws/service/audit.html#ログの収集)をし、[適切に管理](/guide/aws/service/audit.html#管理ポリシー)することで遵守されます。

#### 2.7 CloudTrailログがSSE-KMSで暗号化設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure CloudTrail logs are encrypted at rest using KMS CMKs*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.7 | 必須 | あり |

この項目は、OrBITコアが[CloudTrailログの収集](/guide/aws/service/audit.html#ログの収集)をし、[適切に管理](/guide/aws/service/audit.html#管理ポリシー)することで遵守されます。

#### 2.8 KMSマスタキーがローテーション設定(365日以内)されていること <Badge text="推奨" type="warning"/>
*(original) Ensure rotation for customer created CMKs is enabled*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.8 | 推奨 | 逸脱検出のみ |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)にて、[「*AWS Config Rules*(cmk-backing-key-rotation-enabled)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/cmk-backing-key-rotation-enabled.html)を設定することで遵守されます。
::: warning ATTENTION
現在、全リージョンではなくOrBITが[サポートするリージョン](/guide/aws/support-region.html)のみになります。
:::

#### 2.9 全リージョンでVPC Flow Logsが有効化されていること <Badge text="推奨" type="warning"/>
*(original) Ensure VPC flow logging is enabled in all VPCs*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 2.9 | 推奨 | 逸脱検出のみ |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)にて、[「*AWS Config Rules*(vpc-flow-logs-enabled)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/vpc-flow-logs-enabled.html)を設定することで遵守されます。
::: warning ATTENTION
現在、全リージョンではなくOrBITが[サポートするリージョン](/guide/aws/support-region.html)のみになります。
:::

#### 2.10 CloudTrailログを解析可能な環境が整っていること <Badge text="推奨" type="warning"/>
*(original)いらないですかね？*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| なし | なし | 推奨 | あり |

この項目は、OrBITが[ログの解析環境と手順](/guide/aws/service/audit.html#操作ログの確認と解析)を提供することで遵守されます。


### 3. Monitoring
脅威、およびポリシーからの逸脱を検知する仕組みとその通知に関する項目です。

#### 3.1 許可されていないAPIコールに対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for unauthorized API calls*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.1 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.errorCode = "*UnauthorizedOperation" || 
$.errorCode = "AccessDenied*"
'/>

#### 3.2 MFA無しでのコンソールログインに対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for Management Console sign-in without MFA*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.2 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = "ConsoleLogin" && 
$.additionalEventData.MFAUsed != "Yes" && 
$.userIdentity.type != "AssumedRole"
'/>

#### 3.3 ルートユーザーの利用に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for usage of "root" account*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.3 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.userIdentity.type = "Root" &&
$.userIdentity.invokedBy NOT EXISTS &&
$.eventType != "AwsServiceEvent"
'/>

#### 3.4 IAMポリシーの変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for IAM policy changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.4 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName=DeleteGroupPolicy ||
$.eventName=DeleteRolePolicy ||
$.eventName=DeleteUserPolicy || 
$.eventName=PutGroupPolicy ||
$.eventName=PutRolePolicy || 
$.eventName=PutUserPolicy ||
$.eventName=CreatePolicy ||
$.eventName=DeletePolicy || 
$.eventName=CreatePolicyVersion || 
$.eventName=DeletePolicyVersion || 
$.eventName=AttachRolePolicy || 
$.eventName=DetachRolePolicy || 
$.eventName=AttachUserPolicy || 
$.eventName=DetachUserPolicy || 
$.eventName=AttachGroupPolicy || 
$.eventName=DetachGroupPolicy
'/>

#### 3.5 CloudTrail設定の変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for CloudTrail configuration changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.5 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = CreateTrail  ||
$.eventName = UpdateTrail  ||
$.eventName = DeleteTrail  || 
$.eventName = StartLogging ||
$.eventName = StopLogging
'/>

#### 3.6 コンソールへのログイン失敗に対して、アラーム通知設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure a log metric filter and alarm exist for AWS Management Console authentication failures*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.6 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = ConsoleLogin &&
$.errorMessage = "Failed authentication"
'/>

#### 3.7 KMSマスターキーの無効化またはスケジュール削除に対して、アラーム通知設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure a log metric filter and alarm exist for disabling or scheduled deletion of customer created CMKs*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.7 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventSource = kms.amazonaws.com &&
($.eventName=DisableKey || $.eventName=ScheduleKeyDeletion)
'/>

#### 3.8 S3バケットポリシー変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for S3 bucket policy changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.8 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventSource = s3.amazonaws.com && 
( $.eventName = PutBucketAcl || 
  $.eventName = PutBucketPolicy || 
  $.eventName = PutBucketCors) || 
  $.eventName = PutBucketLifecycle || 
  $.eventName = PutBucketReplication || 
  $.eventName = DeleteBucketPolicy || 
  $.eventName = DeleteBucketCors || 
  $.eventName = DeleteBucketLifecycle || 
  $.eventName = DeleteBucketReplication
)'/>

#### 3.9 AWS Config設定の変更に対して、アラーム通知設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure a log metric filter and alarm exist for AWS Config configuration changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.9 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventSource = config.amazonaws.com && 
( $.eventName=StopConfigurationRecorder ||
  $.eventName=DeleteDeliveryChannel || 
  $.eventName=PutDeliveryChannel ||
  $.eventName=PutConfigurationRecorder
)'/>

#### 3.10 Security Group設定の変更に対して、アラーム通知設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure a log metric filter and alarm exist for security group changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.10 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = AuthorizeSecurityGroupIngress ||
$.eventName = AuthorizeSecurityGroupEgress || 
$.eventName = RevokeSecurityGroupIngress ||
$.eventName = RevokeSecurityGroupEgress) || 
$.eventName = CreateSecurityGroup ||
$.eventName = DeleteSecurityGroup
'/>

#### 3.11 Network ACL設定の変更に対して、アラーム通知設定されていること <Badge text="推奨" type="warning"/>
*(original) Ensure a log metric filter and alarm exist for changes to Network Access Control Lists*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.11 | 推奨 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = CreateNetworkAcl ||
$.eventName = CreateNetworkAclEntry ||
$.eventName = DeleteNetworkAcl ||
$.eventName = DeleteNetworkAclEntry || 
$.eventName = ReplaceNetworkAclEntry ||
$.eventName = ReplaceNetworkAclAssociation
'/>

#### 3.12 Internet Gateway設定の変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for changes to network gateways*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.12 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = CreateCustomerGateway || 
$.eventName = DeleteCustomerGateway ||
$.eventName = AttachInternetGateway || 
$.eventName = CreateInternetGateway ||
$.eventName = DeleteInternetGateway || 
$.eventName = DetachInternetGateway
'/>

#### 3.13 Route Table設定の変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for route table changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.13 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = CreateRoute ||
$.eventName = CreateRouteTable || 
$.eventName = ReplaceRoute || 
$.eventName = ReplaceRouteTableAssociation || 
$.eventName = DeleteRouteTable || 
$.eventName = DeleteRoute || 
$.eventName = DisassociateRouteTable
'/>

#### 3.14 VPC設定(新規作成、削除やVPC Peering, Classic Link等)の変更に対して、アラーム通知設定されていること <Badge text="必須" type="error"/>
*(original) Ensure a log metric filter and alarm exist for VPC changes*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 3.14 | 必須 | あり |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)で遵守されます。

<CodeDetail
title="このアラームの対象となるアクションを見る" 
code='$.eventName = CreateVpc ||
$.eventName = DeleteVpc || 
$.eventName = ModifyVpcAttribute ||
$.eventName = AcceptVpcPeeringConnection ||
$.eventName = CreateVpcPeeringConnection || 
$.eventName = DeleteVpcPeeringConnection || 
$.eventName = RejectVpcPeeringConnection || 
$.eventName = AttachClassicLinkVpc ||
$.eventName = DetachClassicLinkVpc ||
$.eventName = DisableVpcClassicLink) || 
$.eventName = EnableVpcClassicLink
'/>

#### 3.15 各種アラームの通知先は常に最新状態にメンテナンスされていること <Badge text="必須" type="error"/>
*(original)いらないですかね？*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| なし | なし | 必須 | なし |

この項目は、OrBITではサポートされません。


### 4. Networking
ネットワークの構成、および通信ポートの公開範囲に関する項目です。

#### 4.1 Security Groupにて、0.0.0.0/0からport 22(SSH)への接続が許可されていないこと <Badge text="必須" type="error"/>
*(original) Ensure no security groups allow ingress from 0.0.0.0/0 to port 22*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 4.1 | 必須 | 逸脱検出のみ |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)にて、[「AWS Config Rules(restricted-common-ports)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/restricted-common-ports.html)を設定することで遵守されます。

#### 4.2 Security Groupにて、0.0.0.0/0からport 3389(RDP)への接続が許可されていないこと <Badge text="必須" type="error"/>
*(original) Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 4.2 | 必須 | 逸脱検出のみ |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)にて、[「AWS Config Rules(restricted-common-ports)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/restricted-common-ports.html)を設定することで遵守されます。

#### 4.3 デフォルトのSecurity Groupがすべての通信を許可していないこと <Badge text="推奨" type="warning"/>
*(original) Ensure the default security group of every VPC restricts all traffic*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 4.3 | 必須 | 逸脱検出のみ |

この項目は、[OrBITベースライン](/guide/aws/reference/baseline.html)にて、[「AWS Config Rules(vpc-default-security-group-closed)」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/vpc-default-security-group-closed.html)を設定することで遵守されます。

#### 4.4 VPC Peering越しのルーティングは必要最低限に絞られていること <Badge text="任意" type="tip"/>
*(original) Ensure routing tables for VPC peering are "least access"*
| 引用元 | 引用項番 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :----------: |
| CIS v1.2.0 | 4.4 | 任意 | なし |

この項目は、OrBITではサポートされません。

## 特定の操作に対する制限
OrBITではセキュリティポリシーに準拠するため、AWSアカウントに対して操作制限を設けています。
これには、例えば、セキュリティポリシーからの逸脱を予防する操作や、ベースラインリソースの削除が含まれます。

以下に、制限される操作項目を示します。

| AWSサービス | 制限される操作 | 対象リソース |
| :---- | :---- | :---- |
| CloudTrail | DeleteTrail<br>PutEventSelectors<br>StopLogging<br>UpdateTrail | arn:aws:cloudtrail:*:*:trail/aws-controltower-* |
| CloudWatch | Put*<br>Delete*<br>SetAlarmState<br>EnableAlarmActions<br>DisableAlarmActions | arn:aws:cloudwatch:*:*:alarm:orbit-* |
| CloudWatch<br>Events | PutRule<br>PutTargets<br>RemoveTargets<br>DisableRule<br>DeleteRule | arn:aws:events:*:*:rule/aws-controltower-* |
| CloudWatch<br>Events | Create*<br>Delete*<br>Put*<br>Remove* | arn:aws:events:*:*:rule/orbit-* |
| CloudWatch<br>Logs | AssociateKmsKey<br>DisassociateKmsKey<br>PutResourcePolicy<br>PutRetentionPolicy<br>Delete* | arn:aws:logs:*:*:log-group:aws-controltower/CloudTrailLogs:* |
| Config | TagResource<br>UntagResource | "aws-control-tower"<br>のタグが付与されたリソースすべて |
| Config | DeleteConfigurationRecorder<br>DeleteDeliveryChannel<br>DeleteRetentionConfiguration<br>PutConfigurationRecorder<br>PutDeliveryChannel<br>PutRetentionConfiguration<br>StopConfigurationRecorder | すべて |
| Config |PutConfigRule<br>DeleteConfigRule<br>DeleteEvaluationResults<br>DeleteConfigurationAggregator<br>PutConfigurationAggregator | "aws:ResourceTag/aws-control-tower": "managed-by-control-tower"<br>の文字列が付与されたリソースすべて |
| Lambda | AddPermission<br>CreateEventSourceMapping<br>CreateFunction<br>DeleteEventSourceMapping<br>DeleteFunction<br>DeleteFunctionConcurrency<br>PutFunctionConcurrency<br>RemovePermission<br>UpdateEventSourceMapping<br>UpdateFunctionCode<br>UpdateFunctionConfiguration | arn:aws:lambda:*:*:function:aws-controltower-* |
| SNS | AddPermission<br>CreateTopic<br>DeleteTopic<br>RemovePermission<br>SetTopicAttributes | arn:aws:sns:*:*:aws-controltower-* |
| SNS | AddPermission<br>Create*<br>Delete*<br>Set*<br>AddPermission<br>RemovePermission | arn:aws:sns:*:*:orbit-* |
| GuardDuty | CreateDetector<br>DeleteDetector<br>UpdateDetector<br>CreateMembers<br>InviteMembers<br>DeclineInvitations<br>DeleteInvitations | arn:aws:guardduty:*:*:detector/* |

::: warning ATTENTION
基本的にこれらの操作制限の緩和はできませんが、サービス開発に大きな支障をきたす場合は、[「問い合わせ窓口」](/support/contact.html)よりお問い合わせください。
:::

