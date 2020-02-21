# 脅威検知


[[toc]]

## セキュリティポリシー
OrBITでは、CIS(Center for Internet Security)というセキュリティ促進を目的とした米国の非営利団体が公開しているセキュリティ基準をベースに、いくつかの要件を追加したものをセキュリティポリシーとして定義しており、そのポリシーに準拠したAWSアカウントを提供します。

CISとは下記のような非営利団体です。
>米国のNSA(National Security Agency/国家安全保障局)、DISA(Difense Informaton Systems Agency/国防情報システム局)、NIST(National Institute of Standards and Technology/米国立標準技術研究所)などの米国政府機関と、企業、学術機関などが協力して、インターネット・セキュリティ標準化に取り組む団体の名称。
公開しているベンチマーク


CISでは、セキュリティの専門家ベストプラクティスに従ったベンチマークというものを公開しています。

原文は以下を参照してください。
https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf


## ガードレール


## 利用するAWSサービス
AWSアカウントをセキュアに利用するために、以下のサービスを利用しています。

#### 「予防」のセキュリティガードレール
---
- ***AWS Organizations***
    詳細は以下を参照してください。
    - [「AWS CloudTrailユーザーガイド」](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
    - [「AWS CloudTrail料金」](https://aws.amazon.com/jp/cloudtrail/pricing/)

#### 「検出」のセキュリティガードレール
---

- ***AWS CloudWatch Alarm***
    詳細は以下を参照してください。
    - [「AWS CloudTrailユーザーガイド」](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
    - [「AWS CloudTrail料金」](https://aws.amazon.com/jp/cloudtrail/pricing/)

- ***AWS Config Rule***
    詳細は以下を参照してください。
    - [「AWS CloudTrailユーザーガイド」](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
    - [「AWS CloudTrail料金」](https://aws.amazon.com/jp/cloudtrail/pricing/)

- ***Amazon GuardDuty***

    詳細は以下を参照してください。
    - [「AWS CloudTrailユーザーガイド」](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
    - [「AWS CloudTrail料金」](https://aws.amazon.com/jp/cloudtrail/pricing/)


## セキュリティポリシー

### 1. IAM

#### 1.1 ルートユーザが日常的に利用されていないこと <Badge text="必須" type="error"/>
##### *Avoid the use of the "root" account*
| 引用元 | 項目番号 | 遵守レベル | OrBITでの提供 |
| :----: | :-----: | :-------: | :-----------: |
| CIS v1.2.0 | 1.1 | 必須 | あり |

このガードレールにより、ログアーカイブアカウントでの Amazon S3 バケットの保管時に暗号化が有効になります。これは、必須のガイダンスによる予防的ガードレールです。デフォルトでは、このガードレールはコア OU で有効になっています。

このポリシーは「予防」のガードレールにて、実装されています。
<CodeDetail title="このポリシーを見る" code="test"/>

#### 1.2 コンソールログイン用のパスワードが設定されたIAMユーザにMFAが有効化されていること<Badge text="必須" type="error"/>

#### 1.11 パスワードの有効期限が90日以内であること <Badge text="任意" type="tip"/>
### 2. Logging

### 3. Monitoring

### 4. Networking


::: tip NOTE
「予防」のガードレールで禁止される項目は、運用状況により変更される可能性があります。
:::

## 「検出」のガードレール

以下の項目が検出されます。

| 検出項目      | 検出手段 |  |
| ------------ |:------------:| ------------:|
| foo          | bar          | baz          |
| qux          | quux         | corge        |
| grault       | garply       | waldo        |

### アーキテクチャ

### 検出時のエスカレーション

### 自身の環境で検出結果を受け取る設定
