# ベースラインのリソース一覧
OrBITではAWSアカウントの払い出しの際に、全てのAWSアカウントに共通してベースラインというリソースをプロビジョニングします。ここでは、そのベースラインのリソースに関する仕様について記載しています。

[[toc]]

## アーキテクチャ
各AWSアカウントでのベースラインの構成は以下の通りです。

<CaptionedImage src="" caption="アーキテクチャ"/>

## リソース管理
ベースラインのリソースは全て*CloudFormation*のスタックとして管理されます。  
以下の命名規則に該当するスタックがベースラインのリソースを管理していますので、直接的なスタックの変更や削除はご遠慮ください。
```
StackSet-SC-904580840362-XXX
StackSet-AWSControlTowerBP-BASELINE-XXX
```

::: danger IMPORTANT
変更された際はご利用頂いているAWSアカウントがOrBITのサポート対象外となります。
:::

## リソース一覧
ここでは、*CloudFormation*のスタックとして提供される各種リソースについて説明します。
より詳細な情報については、*CloudFormation*のコンソール画面からご確認ください。

### 監査ログ(API)スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CLOUDTRAIL-XXX*

これらのリソースは、AWSアカウント内の**全てのAPIコールを記録・出力**することで、監査や解析に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudTrail | 証跡 | aws-controltower-BaselineCloudTrail | すべて*1 | 監査ログの記録 |
| CloudWatch<br>Logs | ロググループ | aws-controltower/CloudTrailLogs | オレゴン | 監査ログの解析 |
| IAM | IAMロール | aws-controltower-CloudWatchLogsRole | すべて*2 |　監査ログの出力権限 |

*1 *CloudTrail*の証跡自体はオレゴンに作成されますが、**「証跡情報を全てのリージョンに適用」** のオプションが有効になっているため、すべてのリージョンで有効になります。
*2 IAMはグローバルサービスであり、リージョン境界が無いため、すべてのリージョンと同義として扱います。

### 監査ログ(リソース構成)スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CONFIG-XXX*

これらのリソースは、AWSアカウント内の**特定のリソースに関する構成変更履歴を記録**することで、監査や解析に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| Config | 記録 | aws-controltower-BaselineConfigRecorder | サポートリージョン | 監査ログの記録 |
| Config | ログ転送 | aws-controltower-BaselineConfigDeliveryChannel | サポートリージョン | 監査ログの転送 |
| Config | ログ転送承認 | なし*1 | サポートリージョン |　監査ログ転送の承認 |

*1 リソース名はありませんが、ARNは以下の形式になります。
`arn:aws:config:us-west-2:012345678910:aggregation-authorization/057922233889/us-east-2`

::: warning ATTENTION
現時点では、*AWS Config*はサポートリージョンでのみ有効であることに注意してください。
:::

### セキュリティ情報集約スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CLOUDWATCH-XXX*

これらのリソースは、AWSアカウント内の**セキュリティ情報を配信・転送**することで、監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudWatch<br>Event | ルール | aws-controltower-ConfigComplianceChangeEventRule | サポートリージョン | 準拠状態変更の通知 |
| SNS | トピック | aws-controltower-SecurityNotifications | サポートリージョン | 情報の配信 |
| SNS | サブスクリプション | ランダム*1 | サポートリージョン | 情報の配信 |
| Lambda | 関数 | aws-controltower-NotificationForwarder | サポートリージョン | 情報の転送 |
| CloudWatch<br>Logs | ロググループ | /aws/lambda/aws-controltower-NotificationForwarder | サポートリージョン | 関数ログの確認 |

*1 リソース名はランダム文字列が付与されますが、エンドポイントは以下のLambdaになります。
`arn:aws:lambda:us-east-2:012345678910:function:aws-controltower-NotificationForwarder`

### クロスアカウントアクセス制御スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-ROLES-XXX*

これらのリソースは、OrBITが各AWSアカウントのベースラインリソースを管理するために使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| IAM | ロール | aws-controltower-AdministratorExecutionRole | すべて*1 | スタックの更新 |
| IAM | ロール | aws-controltower-ReadOnlyExecutionRole | すべて*1 | スタックの確認 |

*1 IAMはグローバルサービスであり、リージョン境界が無いため、すべてのリージョンと同義として扱います。

### ベースライン内アクセス制御スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-SERVICE-ROLES-XXX*

これらのリソースは、ベースライン内でのアクセス制御に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| IAM | ロール | aws-controltower-ConfigRecorderRole | すべて*1 | Configでの利用 |
| IAM | ロール | aws-controltower-ForwardSnsNotificationRole | すべて*1 | Lambdaでの利用 |

*1 IAMはグローバルサービスであり、リージョン境界が無いため、すべてのリージョンと同義として扱います。

### セキュリティポリシー準拠状態確認スタック
---
(スタック名) **

これらのリソースは、AWSアカウント内の**セキュリティポリシーに対する準拠状態を確認・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| Config | ルール |  | サポートリージョン |  |


### セキュリティポリシー逸脱検出スタック
---
(スタック名) **

これらのリソースは、AWSアカウント内の**セキュリティポリシーを逸脱する可能性のある操作を検知・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudWatch<br>Logs | メトリクスフィルタ | AuthorizationFailuresMetricFilter*1 | オレゴン | []() |
| CloudWatch | アラーム | orbit-CloudTrailAuthorizationFailures | オレゴン | []() |

*1 正確には以下のリソース名が完全リソース名となります。
`SC-012345678910-pp-kvndai34l4m2o-XXXMetricFilter-ZT22M0XB756S`

::: tip NOTE
各アラームとメトリクスは、検知元が*CloudTrail*のログであるため、ロググループの存在するオレゴンにのみプロビジョニングされます。
:::

### 脅威検知スタック
---
(スタック名) *StackSet-SC-904580840362-pp-5zrwvh6w7bp3o-XXX*

これらのリソースは、AWSアカウント内の**脅威を検知・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| GuardDuty | ディテクタ | ランダム*1 | すべて | 脅威の検知 |
| CloudWatch<br>Event | ルール | orbit-GuardDutyFindingsDetectEventRule | すべて | 脅威の通知 |
| SNS | トピック | orbit-AggregateGuardDutyNotification | すべて | 脅威の配信 |

*1 GuardDutyを有効にした際に作成されるDetectorのIDが該当します。