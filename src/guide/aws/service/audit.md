# 監査ログ記録・収集サービス

クラウドを利用したサービスにおいて、監査ログを記録することは非常に重要です。

「いつ」「誰が」「何を」操作したかを記録することで、利用状況や不正アクセスの有無を把握し、情報漏洩といった事故が発生した際の正確な検知を可能にします。また、事後対応の施策として活用するだけでなく、兆候をつかむことで予防にも役立ちます。

OrBITでは、監査ログを記録・収集する仕組みを備えたAWSアカウントを提供します。

[[toc]]

## 利用するAWSサービス
AWSアカウント上での監査ログの記録には、以下のサービスを利用します。

- ***AWS CloudTrail***

    AWSにおけるユーザーの操作イベントを記録するサービスです。
    いつ、誰(IAMユーザーやロール、AWSのサービス等)が、どのような作業を行ったのかを記録することで、サービスの運用監査やコンプライアンス、セキュリティなどのリスク管理業務を支援します。

    詳細は以下を参照してください。
    - [「AWS CloudTrail ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
    - [「AWS CloudTrail 料金」](https://aws.amazon.com/jp/cloudtrail/pricing/)

- ***AWS Config***

    AWSにおけるリソースの構成変更履歴を記録するサービスです。
    AWSリソースに関する構成情報や変更履歴を記録し、任意の時点でのリソース設定の詳細な調査や、構成変更時の通知を受け取ることで、監査・セキュリティ分析・リソース変更の追跡・トラブルシューティングを可能にします。

    詳細は以下を参照してください。
    - [「AWS Config ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/WhatIsConfig.html)
    - [「AWS Config 料金」](https://aws.amazon.com/jp/config/pricing/)

::: warning ATTENTION
AWSアカウントでは、[セキュリティポリシー](/guide/aws/service/security.html#特定の操作に対する制限)により*AWS CloudTrail* と *AWS Config*を無効にすることはできません。
:::

## ログ種別
OrBITでは、以下の２種類の監査ログを記録します。

- 操作ログ
    
    操作ログは、マネジメントコンソールやAWS CLI経由で行われたすべてのAPIを記録したログであり、*AWS CloudTrail*のサービスによって管理されます。

- 構成変更ログ

    構成変更ログは、特定のリソースに対しての変更や削除の履歴を記録したログであり、*AWS Config*のサービスによって管理されます。

## アーキテクチャ
監査ログの記録、および収集する仕組みは、[「ベースラインのアーキテクチャ」](/guide/aws/reference/baseline.html#アーキテクチャ)を参照してください。

## 操作ログの確認と解析
操作ログは、基本的にマネジメントコンソールから利用できる*AWS CloudTrail*コンソールにて確認します。
確認の手順については、以下のチュートリアルを参照して下さい。
- [「AWS CloudTrailコンソールを使用して操作ログを確認する」](#aws-cloudtrailコンソールを使用して操作ログを確認する)

また、操作ログは*CloudWatchLogs*へと転送する設定になっています。
*CloudWatchLogs*では、*CloudWatchLogs Insight*という強力な解析ツールを使用することができます。
確認の手順については、以下のチュートリアルを参照して下さい。
- [「CloudWatchLogs Insightsを使用して操作ログを解析する」](#cloudwatchlogs-insightsを使用して操作ログを解析する)

::: warning ATTENTION
*CloudTrail*のログはアクティビティが発生してから90日間保管されますが、*CloudWatchLogs*に転送されるログは14日間で失効します。
:::

## 構成変更ログの確認と解析
構成変更ログは、基本的にマネジメントコンソールから利用できる*AWS Config*コンソールにて確認・解析します。
確認・解析の手順については、以下のチュートリアルを参照して下さい。
- [「Configコンソールを使用して構成変更ログを確認する」](#configコンソールを使用して構成変更ログを確認する)
- [「Configコンソールを使用して構成変更ログの詳細を確認する」](#configコンソールを使用して構成変更ログの詳細を確認する)

## ログの収集
AWSアカウントに記録されたすべての監査ログは、OrBITコアへと転送され、厳重に管理されます。

### 管理ポリシー
---
各AWSアカウントから収集したログは以下のポリシーにて管理されます。

| 項目 | 設定 |
| :---: | :----: | 
| 公開範囲 |　OrBIT管理者のみ閲覧可能 |　
| 暗号化 | 有効(AES-256) |
| バージョニング | 有効 | 
| ログファイルの検証 | 有効 |
| アクセスログの記録 | 有効 |
| 保管期間　| 365日 |

::: tip NOTE
監査ログの保管に掛かる料金はOrBITにて負担しますが、保管期間は365日までとなっています。もし、これ以上の期間残しておく必要がある際はご連絡ください。
:::

### 解析依頼
---
AWSアカウントで記録していた監査ログが失効してしまった場合、[「作業の依頼フォーム？」](/request/create-ticket.html)から監査ログの解析依頼を申請できます。

## チュートリアル

### AWS CloudTrailコンソールを使用して操作ログを確認する
ここでは、操作ログを確認するために、マネジメントコンソールから利用可能な*AWS CloudTrail*コンソールを使った確認の仕方を紹介します。

1. マネジメントコンソール にサインインし、[AWS CloudTrailコンソール](https://console.aws.amazon.com/cloudtrail/home/)を開きます。

2. 最新のイベントに関するダッシュボードの情報を確認します。
これらのイベントの1つは ConsoleSignin イベントである必要があり、これはマネジメントコンソール にサインインしたことを示しています。 
![](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/images/cloudtrail-dashboard.png)

3. イベントの詳細を表示するには、これを展開します。
![](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/images/cloudtrail-dashboard-expand-event.png)

4. ナビゲーションペインで **[Event history (イベント履歴)]** を選択します。
最新のイベントが最初に表示された、フィルタリングされたイベントのリストが表示されます。イベントのデフォルトのフィルターは読み取り専用で、**[false]** に設定されています。削除アイコンを選択することで、このフィルターをクリアできます。 
![](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/images/cloudtrail-event-history.png)

5. デフォルトのフィルターなしでさらに多くのイベントが表示されます。多くの方法でイベントをフィルタリングすることができます。たとえば、すべてのコンソールログインイベントを表示するには、**[Event name (イベント名)]** を選択して、**[ConsoleLogin]** を指定します。フィルターはユーザーが選択できます。
![](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/images/cloudtrail-event-history-filters.png)

6. イベント履歴を保存するには、CSVまたはJSON形式のファイルとしてダウンロードします。
![](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/images/cloudtrail-event-history-download.png)

これでこのチュートリアルは終了です。

### CloudWatchLogs Insightsを使用して操作ログを解析する
このチュートリアルについては、以下のサイトを参照してください。
- [「CloudWatch Logs Insights で監査ログの分析をしてみる」](https://dev.classmethod.jp/cloud/aws/analyze-cloudtrail-cloud-watch-logs-insights/)

### Configコンソールを使用して構成変更ログを確認する
このチュートリアルについては、以下のサイトを参照してください。
- [「AWS Configで検出されたリソースの検索」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/looking-up-discovered-resources.html)

### Configコンソールを使用して構成変更ログの詳細を確認する
このチュートリアルについては、以下のサイトを参照してください。
- [「AWS Configで検出されたリソースの設定詳細の表示」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/view-manage-resource-console.html)