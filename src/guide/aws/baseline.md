# ベースラインのリソース一覧
OrBITではAWSアカウントの払い出しの際に、全てのAWSアカウントに共通してベースラインというリソースをプロビジョニングします。ここでは、そのベースラインのリソースに関する仕様について記載しています。

[[toc]]

## アーキテクチャ
各AWSアカウントにおけるベースラインのリソースは、その目的毎にスタックという名称で分類されます。スタック、および各スタックに含まれるリソースの構成を示した図が以下になります。
<CaptionedImage src="baseline_architecture.png" caption="ベースラインアーキテクチャ"/>

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
ここでは、スタックとして提供される各リソースについて説明します。
より詳細な情報については、*CloudFormation*のコンソール画面から直接ご確認ください。

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
(スタック名) *StackSet-SC-904580840362-pp-op2ztodi3ahpk-XXX*

これらのリソースは、AWSアカウント内の**セキュリティポリシーに対する準拠状態を確認・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| Config | ルール | orbit-AccessKeyRotated | サポートリージョン | ポリシー[[1.4]]()<br>準拠のため |
| Config | ルール | orbit-CMKBackingKeyRotationEnabled | サポートリージョン | ポリシー[[2.8]]()<br>準拠のため |
| Config | ルール | orbit-VpcFlowLogsEnabled | サポートリージョン | ポリシー[[2.9]]()<br>準拠のため |
| Config | ルール | orbit-DisallowSpecifiedPort | サポートリージョン | ポリシー[[4.1/4.2]]()<br>準拠のため |
| Config | ルール | orbit-VpcDefaultSecurityGroupClosed | サポートリージョン | ポリシー[[4.3]]()<br>準拠のため |

### セキュリティポリシー逸脱検出スタック
---
(スタック名) *StackSet-SC-904580840362-pp-wavzgnmpgn4ng-XXX*

これらのリソースは、AWSアカウント内の**セキュリティポリシーを逸脱する可能性のある操作を検知・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudWatch<br>Logs | メトリクスフィルタ | AuthorizationFailuresMetricFilter*1 | オレゴン | ポリシー[[3.1]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailAuthorizationFailures | オレゴン | ポリシー[[3.1]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConsoleSignInWithoutMFAMetricFilter*1 | オレゴン | ポリシー[[3.2]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConsoleSignInWithoutMFA | オレゴン | ポリシー[[3.2]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | RootAccountUsedMetricFilter*1 | オレゴン | ポリシー[[3.3]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailRootAccountUsed | オレゴン | ポリシー[[3.3]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | IAMPolicyChangesMetricFilter*1 | オレゴン | ポリシー[[3.4]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailIAMPolicyChanges | オレゴン | ポリシー[[3.4]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | CloudTrailChangesMetricFilter*1 | オレゴン | ポリシー[[3.5]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConfigChanges | オレゴン | ポリシー[[3.5]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConsoleSignInFailuresMetricFilter*1 | オレゴン | ポリシー[[3.6]]()準拠のため 
| CloudWatch | アラーム | orbit-CloudTrailConsoleSignInFailures | オレゴン | ポリシー[[3.6]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | CMKsDisabledMetricFilter*1 | オレゴン | ポリシー[[3.7]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailCMKsDisabled | オレゴン | ポリシー[[3.7]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | S3BucketPolicyChangesMetricFilter*1 | オレゴン | ポリシー[[3.8]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailS3BucketPolicyChanges | オレゴン | ポリシー[[3.8]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConfigChangesMetricFilter*1 | オレゴン | ポリシー[[3.9]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConfigChanges | オレゴン | ポリシー[[3.9]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | SecurityGroupChangesMetricFilter*1 | オレゴン | ポリシー[[3.10]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailSecurityGroupChanges | オレゴン | ポリシー[[3.10]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | NetworkAclChangesMetricFilter*1 | オレゴン | ポリシー[[3.11]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailNetworkAclChanges | オレゴン | ポリシー[[3.11]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | GatewayChangesMetricFilter*1 | オレゴン | ポリシー[[3.12]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailGatewayChanges | オレゴン | ポリシー[[3.12]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | RouteTableChangesMetricFilter*1 | オレゴン | ポリシー[[3.13]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailRouteTableChanges | オレゴン | ポリシー[[3.13]]()準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | VpcChangesMetricFilter*1 | オレゴン | ポリシー[[3.14]]()準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailVpcChanges | オレゴン | ポリシー[[3.14]]()準拠のため |

*1 正確には以下のリソース名が完全リソース名となります。
`SC-012345678910-pp-wavzgnmpgn4ng-XXXMetricFilter-XXX`

::: tip INFO
各アラームとメトリクスは、検知元が*CloudTrail*のログであるため、ロググループの存在するオレゴンにのみプロビジョニングされます。
:::

### 脅威検知スタック
---
(スタック名) *StackSet-SC-904580840362-pp-jcnxehghcgwci-XXX*

これらのリソースは、AWSアカウント内の**脅威を検知・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| GuardDuty | ディテクタ | ランダム*1 | すべて | 脅威の検知 |
| CloudWatch<br>Event | ルール | orbit-GuardDutyFindingsDetectEventRule | すべて | 脅威の通知 |
| SNS | トピック | orbit-AggregateGuardDutyNotification | すべて | 脅威の配信 |

*1 GuardDutyを有効にした際に作成されるDetectorのIDが該当します。