# 監視とエスカレーション

クラウドを利用するにあたって、[セキュリティ](/guide/aws/security)は非常に重要であり、また、[脅威検知](/guide/aws/thread-detection)といったセキュリティインシデントを把握可能な仕組み作りや体制の構築は非常に重要です。

OrBITではセキュリティポリシーを定義するだけでなく、セキュリティインシデントが発生した際に、通知を受け取る事ができる仕組みを提供します。また、重大なインシデントに関しては、OrBIT運用チームが直接、プロジェクトへエスカレーションするサービスを提供します。

[[toc]]

## 利用するAWSサービス
OrBITでは、セキュリティの監視に、以下のサービスを利用します。

- ***Amazon Simple Notification Service (Amzaon SNS)***

  サブスクライブしているクライアントへのメッセージの配信、管理を行うサービスです。
  Eメールをはじめとした、様々なプロトコルでサブスクライブすることが可能であり、検知した内容を本サービスを通じて通知することにより、監視を実現します。

    詳細は以下を参照してください。
    - [「Amazon SNSユーザーガイド」](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html)
    - [「Amazon SNS料金」](https://aws.amazon.com/jp/sns/pricing/)    

## 監視対象

- *Amazon GuardDuty*の検知結果
- *CloudTrail*のイベントログ
- *ConfigRule*の評価結果


## アーキテクチャ
監視対象から通知を受け取る仕組みに関しては、以下を参照してください。
- [ベースラインのアーキテクチャ](/guide/aws/baseline#アーキテクチャ)

## 監視設定
プロジェクト側で通知を受け取るには抗する

## セキュリティエスカレーション
OrBITでは、緊急度の高いインシデントが発生した場合、プロジェクトへエスカレーションするサービスを提供しています。

### エスカレーションフロー
---
インシデントの発生から解消までのエスカレーションフローを以下に示します。
また、エスカレーションフローにおけるプロジェクト側での調査や判断についても説明します。
<CaptionedImage src="escalation.png" caption="セキュリティエスカレーションのフロー"/>

#### 1. アラート受信
インシデントが発生するとプロジェクト側のAWSアカウントの*Amazon SNS*トピックに検知した内容が発行されます。

::: warning ATTENTION
プロジェクト側でアラートを受信する場合は、事前にSNSトピックの購読が必要です。
以下を参照して、設定してください。
- [検知した脅威の通知](/guider/aws/threat-detection#検知した脅威の通知)
:::

#### 2. 要因の調査
アラートの受信後は、発生した要因を調査します。
要因の調査は、発生元のサービスによって異なります。
それぞれ、以下を参照して調査を行ってください。
- *Amazon GuardDuty*からの通知の場合
- *CloudTrail*からの通知の場合
- *Config Rule*からの通知の場合

同様のアラートは、**OrBIT運用チーム**でも受け取っています。
**OrBIT運用チーム**では、AWSアカウントの利用目的、およびアラート種別を鑑みた上で、プロジェクトへ連絡するか否かを決定します。

連絡が必要と判断した場合は、以下の方へEメールにて連絡を行います。
- **「プロジェクト責任者」** の役割を割り当てられた方
- **「セキュリティ担当者」** の役割を割り当てられた方

::: warning ATTENTION
プロジェクト側でアラートの受信設定をしている場合、同様のアラート内容に関して要因の調査依頼をお願いする場合があります。
:::

#### 3. 要因が判明したか否か
要因の調査を行った結果、その要因が判明しなかった場合、**OrBIT運用チーム**にご連絡ください。
調査の支援をさせて頂きます。

#### 4. 意図した操作か否か
要因が判明した場合、その要因が意図した操作であるかを確認します。
もし、意図した操作である場合は、問題無と判断し、インシデントは解消されたものとします。

意図した操作でない場合は、対象のリソースが攻撃対象となっている可能性がありますので、その要因を取り除くための対策をする必要があります。

#### 5. 対応可能か否か
攻撃を受けている可能性がある以上、要因を取り除く為、迅速に対策を打つ必要があります。
*Amazon GuardDuty*における各脅威に対する一般的な対策は、以下を参照してください。


もし、対策手段が分からない、という場合は**OrBIT運用チーム**にご連絡ください。
対応方法に関して、支援をさせて頂きます。

::: danger IMPORTANT
OrBIT運用チームは、[責任共有モデル](/guide/common/introduction#責任共有モデル)に準じ、プロジェクト側のリソースを操作する権限を持ちませんので、インシデント対策に関する実作業は行いません。
:::

#### 6. リソースの修正
#### 7. インシデント解消

### エスカレーションの可否判断
エスカレーションフローの[「2. 要因の調査」](#_2-要因の調査)で記載したように、**OrBIT運用チーム**では、プロジェクト側に通知されるものと同様の通知を受け取っており、インシデントが発生したAWSアカウントの利用目的、およびインシデントの重大性を考慮した上で、プロジェクトへエスカレーションするかを判断します。

各監視対象における、エスカレーションの可否は以下のマッピングに従って判断されます。
> :heavy_check_mark:がついている場合、エスカレーションを実施します。

- *Amazon GuardDuty*の検知結果

| 検証環境<br>開発環境<br>ステージング環境 | 本番環境 | 重要度 | 結果タイプ | 概要 |
| :---: | :---: | :---: | :---- | :---- |
|                           | :heavy_check_mark:    | 中    | Backdoor:EC2/Spambot                                      | EC2 インスタンスがポート 25 でリモートホストと通信して通常と異なる動作を示しています。                                                                                                                   |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/C&CActivity.B!DNS                            | EC2 インスタンスは、既知のコマンドアンドコントロールサーバーに関連付けられるドメイン名をクエリしています。                                                                                                           |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/DenialOfService.Tcp                          | EC2 インスタンスが、TCP プロトコルを使用したサービス拒否 (DoS) 攻撃の実行に利用されている可能性があります。                                                                                                     |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/DenialOfService.Udp                          | EC2 インスタンスが、UDP プロトコルを使用したサービス拒否 (DoS) 攻撃の実行に利用されている可能性があります。                                                                                                     |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/DenialOfService.Dns                          | EC2 インスタンスが、DNS プロトコルを使用したサービス拒否 (DoS) 攻撃の実行に利用されている可能性があります。                                                                                                     |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/DenialOfService.UdpOnTcpPorts                | C2 インスタンスが、TCP ポートで UDP プロトコルを使用したサービス拒否 (DoS) 攻撃の実行に利用されている可能性があります。                                                                                             |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Backdoor:EC2/DenialOfService.UnusualProtocol              | EC2 インスタンスが、異常なプロトコルを使用したサービス拒否 (DoS) 攻撃の実行に利用されている可能性があります。                                                                                                      |
|                           | :heavy_check_mark:    | 中    | Behavior:EC2/NetworkPortUnusual                           | EC2 インスタンスが通常と異なるポートでリモートホストと通信しています。                                                                                                                             |
|                           | :heavy_check_mark:    | 中    | Behavior:EC2/TrafficVolumeUnusual                         | EC2 インスタンスがリモートホストに対して通常と異なる大量のネットワークトラフィックを生成しています。                                                                                                              |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | CryptoCurrency:EC2/BitcoinTool.B!DNS                      | EC2 インスタンスは、暗号通貨関連のアクティビティに関連付けられているドメイン名をクエリしています。                                                                                                               |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | CryptoCurrency:EC2/BitcoinTool.B                          | EC2 インスタンスは、暗号通貨関連のアクティビティに関連付けられている IP アドレスをクエリしています。                                                                                                            |
|                           | :heavy_check_mark:    | 中    | PenTest:IAMUser/KaliLinux                                 | API が Kali Linux EC2 インスタンスから呼び出されました。                                                                                                                            |
|                           | :heavy_check_mark:    | 中    | PenTest:IAMUser/ParrotLinux                               | API が Parrot Security Linux EC2 インスタンスから呼び出されました。                                                                                                                 |
|                           | :heavy_check_mark:    | 中    | PenTest:IAMUser/PentooLinux                               | API が Pentoo Linux EC2 インスタンスから呼び出されました。                                                                                                                          |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Persistence:IAMUser/NetworkPermissions                    | プリンシパルが、通常 AWS アカウントのセキュリティグループ、ルート、ACL のネットワークアクセス許可を変更するために使用される API を呼び出した。                                                                                    |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Persistence:IAMUser/ResourcePermissions                   | プリンシパルが、通常 AWS アカウントのさまざまなリソースのセキュリティアクセスポリシーを変更するために使用される API を呼び出した。                                                                                            |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Persistence:IAMUser/UserPermissions                       | プリンシパルが、通常 AWS アカウントの IAM ユーザー、グループ、ポリシーを追加、変更、削除するために使用される API を呼び出した。                                                                                           |
|                           | :heavy_check_mark:    | 低    | Policy:IAMUser/S3BlockPublicAccessDisabled                | バケットの Amazon S3 ブロックパブリックアクセスが無効になりました                                                                                                                            |
|                           | :heavy_check_mark:    | 低    | Policy:IAMUser/RootCredentialUsage                        | API がルート認証情報を使用して呼び出された。                                                                                                                                          |
|                           | :heavy_check_mark:    | 低(中) | PrivilegeEscalation:IAMUser/AdministrativePermissions     | プリンシパルが許容度の高いポリシーを割り当てようとしています。この動作は特権エスカレーション攻撃に関連付けられます。                                                                                                        |
|                           | :heavy_check_mark:    | 低    | Recon:EC2/PortProbeUnprotectedPort                        | EC2 インスタンスの保護されていないポートを既知の悪意のあるホストが探しています。                                                                                                                        |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Recon:EC2/PortProbeEMRUnprotectedPort                     | EMR クラスターに、セキュリティグループ、アクセスコントロールリスト (ACL)、またはホストのファイアウォール (Linux IPChains など) でブロックされていない EMR 関連の sensitive port ポートがあり、これをインターネットの既知のスキャナーが巧みに見つけようとしていることを知らせます |
|                           | :heavy_check_mark:    | 中    | Recon:IAMUser/TorIPCaller                                 | API が Tor 出口ノードの IP アドレスから呼び出されました。                                                                                                                               |
|                           | :heavy_check_mark:    | 中    | Recon:IAMUser/MaliciousIPCaller.Custom                    | API がカスタム脅威リストにある IP アドレスから呼び出されました。                                                                                                                              |
|                           | :heavy_check_mark:    | 中    | Recon:IAMUser/MaliciousIPCaller                           | API が既知の悪意のある IP アドレスから呼び出されました。                                                                                                                                  |
|                           | :heavy_check_mark:    | 中    | Recon:EC2/Portscan                                        | EC2 インスタンスがリモートホストにアウトバウンドポートスキャンを実行しています。                                                                                                                        |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Recon:IAMUser/NetworkPermissions                          | プリンシパルが、通常 AWS アカウントの既存のセキュリティグループ、ACL、ルートのネットワークアクセス許可を検出するために使用される API を呼び出した。                                                                                  |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Recon:IAMUser/ResourcePermissions                         | プリンシパルが、通常 AWS アカウントのさまざまなリソースに関連付けられたアクセス権限を検出するために使用される API を呼び出した。                                                                                             |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Recon:IAMUser/UserPermissions                             | プリンシパルが、通常 AWS アカウントのユーザー、グループ、ポリシー、アクセス権限を検出するために使用される API を呼び出した。                                                                                               |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | ResourceConsumption:IAMUser/ComputeResources              | プリンシパルが、通常 EC2 インスタンスなどのコンピューティングリソースを起動するために使用される API を呼び出した。                                                                                                    |
|                           | :heavy_check_mark:    | 低    | Stealth:IAMUser/S3ServerAccessLoggingDisabled             | バケットの Amazon S3 サーバーアクセスログ記録が無効になりました                                                                                                                             |
|                           | :heavy_check_mark:    | 低    | Stealth:IAMUser/PasswordPolicyChange                      | アカウントのパスワードポリシーが弱化されています。                                                                                                                                         |
|                           | :heavy_check_mark:    | 低    | Stealth:IAMUser/CloudTrailLoggingDisabled                 | AWS CloudTrail の証跡が無効化されています。                                                                                                                                     |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | Stealth:IAMUser/LoggingConfigurationModified              | プリンシパルが、通常 AWS アカウントの CloudTrail ログ記録の停止、既存ログの削除、その他アクティビティの痕跡を消去するために使用される API を呼び出した。                                                                           |
|                           | :heavy_check_mark:    | 中    | Trojan:EC2/BlackholeTraffic                               | EC2 インスタンスは、ブラックホールと呼ばれるリモートホストの IP アドレスに通信しようとしています。                                                                                                             |
|                           | :heavy_check_mark:    | 中    | Trojan:EC2/DropPoint                                      | EC2 インスタンスは、マルウェアによって収集された認証情報やその他の盗難されたデータによって認識されているリモートホストの IP アドレスに通信しようとしています。                                                                               |
|                           | :heavy_check_mark:    | 中    | Trojan:EC2/BlackholeTraffic!DNS                           | EC2 インスタンスは、ブラックホール IP アドレスにリダイレクトされるドメイン名へのクエリを実行しています。                                                                                                          |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/DriveBySourceTraffic!DNS                       | EC2 インスタンスは、Drive By Download 攻撃の既知のソースであるリモートホストのドメイン名をクエリしています。                                                                                                 |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/DropPoint!DNS                                  | EC2 インスタンスは、マルウェアによって収集された認証情報やその他の盗難されたデータによって認識されているリモートホストのドメイン名をクエリしています。                                                                                     |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/DGADomainRequest.B                             | EC2 インスタンスで、アルゴリズムを使用して生成されたドメインがクエリされています。このようなドメインは、一般的にマルウェアによって悪用されることが多く、EC2 インスタンスが侵害されている場合があります。                                                          |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/DGADomainRequest.C!DNS                         | EC2 インスタンスで、アルゴリズムを使用して生成されたドメインがクエリされています。このようなドメインは、一般的にマルウェアによって悪用されることが多く、EC2 インスタンスが侵害されている場合があります。                                                          |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/DNSDataExfiltration                            | EC2 インスタンスが DNS クエリを通じてデータを密かに抽出しようとしています。                                                                                                                        |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | Trojan:EC2/PhishingDomainRequest!DNS                      | EC2 インスタンスはフィッシング攻撃に関与するクエリ実行のドメインです。EC2 インスタンスは侵害されている可能性があります。                                                                                                  |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | UnauthorizedAccess:EC2/MetadataDNSRebind                  | Amazon EC2 インスタンスが、インスタンスメタデータサービスに解決される DNS ルックアップを実行しています。                                                                                                      |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:IAMUser/TorIPCaller                    | API が Tor 出口ノードの IP アドレスから呼び出されました。                                                                                                                               |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom       | API がカスタム脅威リストにある IP アドレスから呼び出されました。                                                                                                                              |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B          | 世界中でコンソールに対する複数の正常なログインが確認されました。                                                                                                                                  |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:IAMUser/MaliciousIPCaller              | API が既知の悪意のある IP アドレスから呼び出されました。                                                                                                                                  |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:EC2/TorIPCaller                        | EC2 インスタンスが Tor 出口ノードからのインバウンド接続を受信しています。                                                                                                                         |
|                           | :heavy_check_mark:    | 中    | UnauthorizedAccess:EC2/MaliciousIPCaller.Custom           | EC2 インスタンスがカスタム脅威リスト内の IP アドレスとアウトバウンド通信しています。                                                                                                                    |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 低(高) | UnauthorizedAccess:EC2/SSHBruteForce                      | EC2 インスタンスが SSH ブルートフォース攻撃に関与しています。                                                                                                                               |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 低(高) | UnauthorizedAccess:EC2/RDPBruteForce                      | EC2 インスタンスが RDP ブルートフォース攻撃に関与しています。                                                                                                                               |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration | インスタンス起動ロールを通じて EC2 インスタンス専用に作成された認証情報が外部 IP アドレスから使用されています。                                                                                                      |
| :heavy_check_mark:*1                        | :heavy_check_mark:    | 中(高) | UnauthorizedAccess:IAMUser/ConsoleLogin                   | AWS アカウントのプリンシパルによる通常とは違うコンソールへのログインが確認された。                                                                                                                       |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | UnauthorizedAccess:EC2/TorClient                          | EC2 インスタンスは Tor Guard または Authority ノードに接続しています。                                                                                                                  |
| :heavy_check_mark:                          | :heavy_check_mark:    | 高    | UnauthorizedAccess:EC2/TorRelay                           | EC2 インスタンスは、Tor リレーとして Tor ネットワークに接続中です。                                                                                                                          |

*1 この結果タイプは、場合によっては優先度が**高**となり、その場合のみエスカレーションされます。

- *CloudTrail*のイベントログ

| 検証環境<br/>開発環境<br/>ステージング環境 | 本番環境 | アラート名 | 操作内容 |
| :----: | :----: | :---- | :---- |
|                            |      | orbit-CloudTrailAuthorizationFailures   | 許可されていないAPI呼び出し                         |
|                            | :heavy_check_mark:    | orbit-CloudTrailRouteTableChanges       | ルートテーブルの変更                              |
|                            | :heavy_check_mark:    | orbit-CloudTrailS3BucketPolicyChanges   | S3バケットポリシー変更                            |
|                            | :heavy_check_mark:    | orbit-CloudTrailIAMPolicyChanges        | IAMポリシー変更                               |
|                            | :heavy_check_mark:    | orbit-CloudTrailSecurityGroupChanges    | セキュリティグループ変更                            |
|                            | :heavy_check_mark:    | orbit-CloudTrailGatewayChanges          | Customer Gatewayまたは Internet Gateway 変更 |
|                            | :heavy_check_mark:    | orbit-CloudTrailConsoleSignInWithoutMFA | MFAなしのコンソールログイン                         |
|                            | :heavy_check_mark:    | orbit-CloudTrailCMKsDisabled            | CMK無効化                                  |
|                            | :heavy_check_mark:    | orbit-CloudTrailNetworkAclChanges       | ネットワークACL変更                             |
| :heavy_check_mark:                          | :heavy_check_mark:    | orbit-CloudTrailConfigChanges           | Config変更                                |
|                            | :heavy_check_mark:    | orbit-CloudTrailVpcChanges              | VPC変更                                   |
| :heavy_check_mark:                          | :heavy_check_mark:    | orbit-CloudTrailChanges                 | CloudTrail変更                            |
| :heavy_check_mark:                          | :heavy_check_mark:    | orbit-CloudTrailConsoleSignInFailures   | ログイン失敗3回以上                              |
| :heavy_check_mark:                          | :heavy_check_mark:    | orbit-CloudTrailRootAccountUsed         | ルートアカウント使用                              |

- *ConfigRule*の評価結果

| 検証環境<br/>開発環境<br/>ステージング環境 | 本番環境 | ルール名 | 評価条件 |
| :----: | :----: | :---- | :---- |
| | :heavy_check_mark:    | orbit-DisallowSpecifiedPort         | ポート"22"または"3389"に対するSSHトラフィックが制限されていない |
| | :heavy_check_mark:    | orbit-VpcDefaultSecurityGroupClosed | デフォルトセキュリティグループに1つ以上のインバウンドまたはアウトバウンドトラフィックがある |
| | :heavy_check_mark: | orbit-VpcFlowLogsEnabled            | VPCフローログがVPCに対して無効 |
| | :heavy_check_mark: | orbit-AccessKeyRotated              | アクセスキーが90日を超えてローテートされていない |
| | :heavy_check_mark: | orbit-CMKBackingKeyRotationEnabled  | カスタマーマスターキーのローテーションが無効 |