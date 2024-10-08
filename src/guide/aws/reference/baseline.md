---
prev: false
next: false
---

# OrBITベースラインのリソース構成
OrBITでは、AWSアカウントの払い出しの際に、すべてのアカウントに共通してベースラインというリソースをプロビジョニングします。
ここでは、そのベースラインのリソースに関する仕様について記載します。

[[toc]]

## アーキテクチャ
AWSアカウントにおけるベースラインのリソースは、その目的毎にスタックという名称で分類されます。スタック、および各スタックに含まれるリソースの構成を示した図が以下になります。
<CaptionedImage src="baseline_architecture.png" caption="ベースラインアーキテクチャ"/>

## リソース管理
ベースラインのリソースはすべて*CloudFormation*のスタックとして管理されます。  
以下の命名規則に該当するスタックがベースラインのリソースを管理していますので、直接的なスタックの更新や削除は行わないでください。
```
StackSet-SC-904580840362-XXX
StackSet-AWSControlTowerBP-BASELINE-XXX
```

::: danger IMPORTANT
変更した場合、ご利用のAWSアカウントはサポート対象外となります。
:::

## リソース一覧
ここでは、スタックとして提供される各リソースについて説明します。
より詳細な情報については、*CloudFormation*のコンソール画面から直接ご確認ください。

### 監査ログ(API)スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CLOUDTRAIL-XXX*

これらのリソースは、AWSアカウント内の**すべてのAPIコールを記録・出力**することで、監査や解析に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudTrail | 証跡 | aws-controltower-BaselineCloudTrail | すべて*1 | 監査ログの記録 |
| CloudWatch<br>Logs | ロググループ | aws-controltower/CloudTrailLogs | オレゴン | 監査ログの解析 |
| IAM | IAMロール | aws-controltower-CloudWatchLogsRole | すべて*2 |　監査ログの出力権限 |

*1 *CloudTrail*の証跡自体はオレゴンに作成されますが、**「証跡情報をすべてのリージョンに適用」** のオプションが有効になっているため、すべてのリージョンで有効になります。
*2 IAMはグローバルサービスであり、リージョン境界が無いため、すべてのリージョンと同義として扱います。

### 監査ログ(リソース構成)スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CONFIG-XXX*

これらのリソースは、AWSアカウント内の**特定のリソースに関する構成変更履歴を記録**することで、監査や解析に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| Config | 記録 | aws-controltower-BaselineConfigRecorder | [サポートリージョン](/guide/aws/support-region.html) | 監査ログの記録 |
| Config | ログ転送 | aws-controltower-BaselineConfigDeliveryChannel | [サポートリージョン](/guide/aws/support-region.html) | 監査ログの転送 |
| Config | ログ転送承認 | なし*1 | [サポートリージョン](/guide/aws/support-region.html) |　監査ログ転送の承認 |

*1 リソース名はありませんが、ARNは以下の形式になります。
`arn:aws:config:us-west-2:012345678910:aggregation-authorization/057922233889/us-east-2`

::: warning ATTENTION
現時点では、*AWS Config*は[サポートリージョン](/guide/aws/support-region.html)でのみ有効です。
:::

### セキュリティ情報集約スタック
---
(スタック名) *StackSet-AWSControlTowerBP-BASELINE-CLOUDWATCH-XXX*

これらのリソースは、AWSアカウント内の**セキュリティ情報を配信・転送**することで、監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudWatch<br>Event | ルール | aws-controltower-ConfigComplianceChangeEventRule | [サポートリージョン](/guide/aws/support-region.html) | 準拠状態変更の通知 |
| SNS | トピック | aws-controltower-SecurityNotifications | [サポートリージョン](/guide/aws/support-region.html) | 情報の配信 |
| SNS | サブスクリプション | ランダム*1 | [サポートリージョン](/guide/aws/support-region.html) | 情報の配信 |
| Lambda | 関数 | aws-controltower-NotificationForwarder | [サポートリージョン](/guide/aws/support-region.html) | 情報の転送 |
| CloudWatch<br>Logs | ロググループ | /aws/lambda/aws-controltower-NotificationForwarder | [サポートリージョン](/guide/aws/support-region.html) | 関数ログの確認 |

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
| Config | ルール | orbit-AccessKeyRotated | [サポートリージョン](/guide/aws/support-region.html) | ポリシー[[1.4]](/guide/aws/service/security.html#_1-4-アクセスキーが90日以内にローテーションされていること)<br>準拠のため |
| Config | ルール | orbit-CMKBackingKeyRotationEnabled | [サポートリージョン](/guide/aws/support-region.html) | ポリシー[[2.8]](/guide/aws/service/security.html#_2-8-kmsマスタキーがローテーション設定-365日以内-されていること)<br>準拠のため |
| Config | ルール | orbit-VpcFlowLogsEnabled | [サポートリージョン](/guide/aws/support-region.html) | ポリシー[[2.9]](/guide/aws/service/security.html#_2-9-全リージョンでvpc-flow-logsが有効化されていること)<br>準拠のため |
| Config | ルール | orbit-DisallowSpecifiedPort | [サポートリージョン](/guide/aws/support-region.html) | ポリシー[[4.1]](/guide/aws/service/security.html#_4-1-security-groupにて、0-0-0-0-0からport-22-ssh-への接続が許可されていないこと) [[4.2]](/guide/aws/service/security.html#_4-2-security-groupにて、0-0-0-0-0からport-3389-rdp-への接続が許可されていないこと)<br>準拠のため |
| Config | ルール | orbit-VpcDefaultSecurityGroupClosed | [サポートリージョン](/guide/aws/support-region.html) | ポリシー[[4.3]](/guide/aws/service/security.html#_4-3-デフォルトのsecurity-groupがすべての通信を許可していないこと)<br>準拠のため |

### セキュリティポリシー逸脱検出スタック
---
(スタック名) *StackSet-SC-904580840362-pp-wavzgnmpgn4ng-XXX*

これらのリソースは、AWSアカウント内の**セキュリティポリシーを逸脱する可能性のある操作を検知・通知**することで、セキュリティ監視に使用されます。

| AWSサービス | リソース種別 | リソース名 | 展開リージョン | 用途 |
| :---- | :---- | :---- | :---- | :---- |
| CloudWatch<br>Logs | メトリクスフィルタ | AuthorizationFailuresMetricFilter*1 | オレゴン | ポリシー[[3.1]](/guide/aws/service/security.html#_3-1-許可されていないapiコールに対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailAuthorizationFailures | オレゴン | ポリシー[[3.1]](/guide/aws/service/security.html#_3-1-許可されていないapiコールに対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConsoleSignInWithoutMFAMetricFilter*1 | オレゴン | ポリシー[[3.2]](/guide/aws/service/security.html#_3-2-mfa無しでのコンソールログインに対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConsoleSignInWithoutMFA | オレゴン | ポリシー[[3.2]](/guide/aws/service/security.html#_3-2-mfa無しでのコンソールログインに対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | RootAccountUsedMetricFilter*1 | オレゴン | ポリシー[[3.3]](/guide/aws/service/security.html#_3-3-ルートユーザーの利用に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailRootAccountUsed | オレゴン | ポリシー[[3.3]](/guide/aws/service/security.html#_3-3-ルートユーザーの利用に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | IAMPolicyChangesMetricFilter*1 | オレゴン | ポリシー[[3.4]](/guide/aws/service/security.html#_3-4-iamポリシーの変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailIAMPolicyChanges | オレゴン | ポリシー[[3.4]](/guide/aws/service/security.html#_3-4-iamポリシーの変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | CloudTrailChangesMetricFilter*1 | オレゴン | ポリシー[[3.5]](/guide/aws/service/security.html#_3-5-cloudtrail設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConfigChanges | オレゴン | ポリシー[[3.5]](/guide/aws/service/security.html#_3-5-cloudtrail設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConsoleSignInFailuresMetricFilter*1 | オレゴン | ポリシー[[3.6]](/guide/aws/service/security.html#_3-6-コンソールへのログイン失敗に対して、アラーム通知設定されていること)準拠のため 
| CloudWatch | アラーム | orbit-CloudTrailConsoleSignInFailures | オレゴン | ポリシー[[3.6]](/guide/aws/service/security.html#_3-6-コンソールへのログイン失敗に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | CMKsDisabledMetricFilter*1 | オレゴン | ポリシー[[3.7]](/guide/aws/service/security.html#_3-7-kmsマスターキーの無効化またはスケジュール削除に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailCMKsDisabled | オレゴン | ポリシー[[3.7]](/guide/aws/service/security.html#_3-7-kmsマスターキーの無効化またはスケジュール削除に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | S3BucketPolicyChangesMetricFilter*1 | オレゴン | ポリシー[[3.8]](/guide/aws/service/security.html#_3-8-s3バケットポリシー変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailS3BucketPolicyChanges | オレゴン | ポリシー[[3.8]](/guide/aws/service/security.html#_3-8-s3バケットポリシー変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | ConfigChangesMetricFilter*1 | オレゴン | ポリシー[[3.9]](/guide/aws/service/security.html#_3-9-aws-config設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailConfigChanges | オレゴン | ポリシー[[3.9]](/guide/aws/service/security.html#_3-9-aws-config設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | SecurityGroupChangesMetricFilter*1 | オレゴン | ポリシー[[3.10]](/guide/aws/service/security.html#_3-10-security-group設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailSecurityGroupChanges | オレゴン | ポリシー[[3.10]](/guide/aws/service/security.html#_3-10-security-group設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | NetworkAclChangesMetricFilter*1 | オレゴン | ポリシー[[3.11]](/guide/aws/service/security.html#_3-11-network-acl設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailNetworkAclChanges | オレゴン | ポリシー[[3.11]](/guide/aws/service/security.html#_3-11-network-acl設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | GatewayChangesMetricFilter*1 | オレゴン | ポリシー[[3.12]](/guide/aws/service/security.html#_3-12-internet-gateway設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailGatewayChanges | オレゴン | ポリシー[[3.12]](/guide/aws/service/security.html#_3-12-internet-gateway設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | RouteTableChangesMetricFilter*1 | オレゴン | ポリシー[[3.13]](/guide/aws/service/security.html#_3-13-route-table設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailRouteTableChanges | オレゴン | ポリシー[[3.13]](/guide/aws/service/security.html#_3-13-route-table設定の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch<br>Logs | メトリクスフィルタ | VpcChangesMetricFilter*1 | オレゴン | ポリシー[[3.14]](/guide/aws/service/security.html#_3-14-vpc設定-新規作成、削除やvpc-peering-classic-link等-の変更に対して、アラーム通知設定されていること)準拠のため |
| CloudWatch | アラーム | orbit-CloudTrailVpcChanges | オレゴン | ポリシー[[3.14]](/guide/aws/service/security.html#_3-14-vpc設定-新規作成、削除やvpc-peering-classic-link等-の変更に対して、アラーム通知設定されていること)準拠のため |

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


## 利用料金の参考
ベースラインには、利用しているサービスに伴う利用料金が発生し、この料金はプロジェクト側の利用料金として配賦されます。

どの程度の料金が掛かるのか、以下に3つのプロジェクトにおける、過去2か月分の請求サンプルを載せますので、参考にしてください。

::: tip NOTE
実際には、*AWS Config*、*AWS CloudTrail*、*Amazon GuardDuty* 以外のサービスもベースラインでは利用していますが、大きく割合を占めるものでは無いため、ここでは割愛します。
:::

- サンプル１

こちらは、プロジェクトAの開発環境における利用料金の内訳になります。
プロジェクトAの開発人数は2人で、主にサーバーレスによる開発を行っています。

| | プロジェクトA<br>2月分 | プロジェクトA<br>1月分 |
| :----: | :----: | :----: |
| すべての利用料金 | $167.8 | $226.24 |
| ベースライン利用料金の割合 | 8% | 4% |
| ベースラインの利用料金 | $13.59 | $9.34 |
| Config | $12.21 | $8.46 |
| CloudTrail | $0 | $0 | 
| GuardDuty | $1.38 | $0.88 |

ベースラインの利用料金の占める割合は大きくありませんが、*AWS Config*にある程度の料金が掛かっています。*AWS Config*は、リソースに変更がある度に記録を行いますので、設定変更が多発する開発環境では応じて料金も掛かります。

- サンプル2

こちらは、プロジェクトBの開発環境における利用料金の内訳になります。
プロジェクトBの開発人数は3人で、主にサーバーレスによる開発を行っています。

| | プロジェクトB<br>2月分 | プロジェクトB<br>1月分 |
| :----: | :----: | :----: |
| すべての利用料金 | $67.81| $25.54 |
| ベースライン利用料金の割合 | 32% | 43% |
| ベースラインの利用料金 | $21.97 | $11.11 |
| Config | $20.19 | $9.55 |
| CloudTrail | $0 | $0 |
| GuardDuty | $1.78 | $1.56 |

プロジェクトAと同様に、*AWS Config*の利用料金が大半を占めています。
サーバーレスにおける開発環境の場合、全体の料金が抑えられますので、設定変更が多くなると相対的にベースラインの占める割合も高くなります。

- サンプル3

こちらは、プロジェクトCの概念実証における利用料金の内訳になります。
プロジェクトCの開発人数は2人で、主にメディア配信のサービスを利用しています。

| | プロジェクトC<br>2月分 | プロジェクトC<br>1月分 |
| :----: | :----: | :----: |
| すべての利用料金 | $208.92| $181.81 |
| ベースライン利用料金の割合 | 0.5% | 0.6% |
| ベースラインの利用料金 | $1.24 | $1.23 |
| Config | $0.98 | $0.99 |
| CloudTrail | $0 | $0 |
| GuardDuty | $0.26 | $0.24 |

こちらは、メディア配信系のサービスを使用しているということもあり、ベースラインの利用料金が占める割合は低くなります。
<br>

プロジェクトの目的や方向性によって、ベースラインの利用料金は変わってきます。
ご自身のプロジェクトにどのくらい利用料金が掛かっているのか、定期的にコストを確認し、把握することが重要です。

<Footer />