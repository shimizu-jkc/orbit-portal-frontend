# 監査ログの収集

クラウドを利用したサービスにおいて、監査ログを記録する事は非常に重要です。

「いつ」「誰が」「何を」操作したかを記録する事で、利用状況や不正アクセスの有無を把握し、情報漏洩といった事故が発生した際の正確な検知を可能にします。また、事後対応の施策として活用するだけでなく、兆候をつかむ事で予防にも役立てる事ができます。

OrBITでは、監査ログを記録・収集する仕組みを組み込んだ上で、AWSアカウントを提供します。

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
提供されたAWSアカウントでは、*AWS CloudTrail* と *AWS Config*は無効にすることはできません。これは[「予防のセキュリティガードレール」](/guide/aws/security/#「予防」のガードレール)によって制限されるものです。
:::

## ログの収集
また、これらのサービスを有効にすると共に、各種ログがOrBITのコアシステムへとログ転送設定されます。
一元的に厳重に管理されます。


## セキュリティ
各AWSアカウントから収集されたログは、OrBITのコアシステムにより厳重に管理されます。


### 保管期間


## 解析手順

### プロジェクト側での解析
各AWSアカウントで収集されたログは、当該アカウントのCloudWatchの以下のロググループに出力されます。
確認するには、以下の手順を踏んでください。

1. AWSコンソールを開く
1. リージョンをオレゴンに変更する。
2. CloudWatchコンソールを開く
3. `aws-controltower/CloudTrailLogs`のロググループを開く。
4. 
```
aws-controltower/CloudTrailLogs 
```


### コアシステム側での解析

### ～日までのログ

各自のアカウントで確認できるよ。

### それ以降のログ

基盤側でログを1年間持ってるから[ここ](/request/analyze-auditlog)から依頼してね。