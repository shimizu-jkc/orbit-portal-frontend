# 監視・エスカレーションサービス

クラウドを利用するにあたって、[セキュリティ](/guide/aws/service/security.html)は非常に重要であり、また、[脅威検知](/guide/aws/service/threat-detection.html)といったセキュリティインシデントを把握可能な仕組み作りや体制の構築が非常に重要になります。

OrBITではセキュリティポリシーを定義するだけでなく、セキュリティインシデントが発生した際に、通知を受け取る事ができる仕組みを提供します。また、重大なインシデントに関しては、OrBIT管理者が直接、プロジェクトへエスカレーションするサービスを提供します。

[[toc]]

## 利用するAWSサービス
OrBITでは、セキュリティの監視に以下のサービスを利用します。

- ***Amazon Simple Notification Service (Amzaon SNS)***

  サブスクライブしているクライアントへのメッセージの配信、管理を行うサービスです。
  Eメールをはじめとした、様々なプロトコルでサブスクライブすることが可能であり、検知した内容を本サービスを通じて通知することにより、監視を実現します。

  詳細は以下を参照してください。
  - [「Amazon SNSユーザーガイド」](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html)
  - [「Amazon SNS料金」](https://aws.amazon.com/jp/sns/pricing/)    

- ***AWS Chatbot***

  SlackチャンネルやAmazon Chimeチャットルームで、AWSのリソースを簡単にモニタリングできるようにしてくれるサービスです。
  *AWS Chatbot*を使用すると、簡単にSlackと連携が可能で、文面の自動整形機能も備えているため、整えた上で監視設定のコストを抑える事ができます。

  詳細は以下を参照してください。
  - [「AWS Chatbotユーザーガイド」](https://docs.aws.amazon.com/ja_jp/chatbot/latest/adminguide/what-is.html)

  ::: tip INFO
  *AWS Chatbot*の利用自体に料金は掛かりませんが、内部で使用するリソースおよびサービスに対して料金が発生します。
  :::

## 監視対象
OrBITでは、以下の3つのAWSサービスから取得できる情報を監視対象とします。

- *Amazon GuardDuty*の検知結果

  *Amazon GuardDuty*では、悪意のある操作や不正な動作を検知可能であり、その結果について監視する事ができます。詳細については、[「脅威検知」](/guide/aws/service/threat-detection.html)を参照してください。

- *AWS CloudTrail*における特定のイベント

  *AWS CloudTrail*では、すべての操作履歴を記録しており、インシデントが発生する可能性のある操作を検知することで、未然に防ぐことができます。詳細については、[「セキュリティポリシー逸脱検出スタック」](/guide/aws/reference/baseline.html#セキュリティポリシー逸脱検出スタック)を参照してください。
 
- *AWS Config Rules*の評価結果

  *AWS Config Rules*では、セキュリティポリシーに対する準拠状態を評価することができ、迅速に逸脱を検知することができます。詳細については、[「セキュリティポリシー準拠状態確認スタック」](/guide/aws/reference/baseline.html#セキュリティポリシー準拠状態確認スタック)を参照してください。

## アーキテクチャ
監視対象から通知を受け取る仕組みは、[「ベースラインのアーキテクチャ」](/guide/aws/reference/baseline.html#アーキテクチャ)を参照してください。

## 監視設定
プロジェクトで通知を受け取るには、受信したい情報に該当するSNSトピックをサブスクライブする必要があります。任意のサブスクライバを利用することが可能ですので、プロジェクト側の運用に適したプロトコルでサブスクライブしてください。

サブスクライブの対象となるSNSトピックは以下の通りです。
| トピック名 | 展開リージョン | 用途 |
| :---- | :---- | :---- |
| aws-controltower-SecurityNotifications | [サポートリージョン](/guide/aws/support-region.html) | *AWS CloudTrail*における特定のイベント<br>*AWS Config Rules*の評価結果 |
| orbit-AggregateGuardDutyNotification | すべて | *Amazon GuardDuty*の検知結果 |

## セキュリティエスカレーション
OrBITでは、緊急度の高いインシデントが発生した際、プロジェクトの運用担当者へエスカレーションするサービスを提供しています。

::: tip NOTE
もし、運用を外部へ委託する場合など、エスカレーションが不要な場合はご連絡ください。
:::

### エスカレーションフロー
---
インシデントの発生から解消までのエスカレーションフローを以下に示します。
また、エスカレーションフローにおけるプロジェクト側での調査や判断の手順についても説明します。
<CaptionedImage src="escalation.png" caption="セキュリティエスカレーションのフロー"/>

#### 1. アラート受信
インシデントが発生すると、AWSアカウントの*Amazon SNS*トピックに検知した内容が発行され、サブスクライバへと通知されます。

::: warning ATTENTION
プロジェクト側でアラートを受信する場合は、事前に該当するSNSトピックのサブスクライブが必要です。
:::

#### 2. 要因の調査
アラートの受信後は、発生した要因を調査します。
要因の調査は発生元によって異なりますので、該当する監視対象の調査手順をを参考にしながら調査を行ってください。
- *Amazon GuardDuty*からの通知の場合は、[「脅威内容の確認」](/guide/aws/service/threat-detection.html#脅威内容の確認)を参考にしてください。
- *AWS CloudTrail*からの通知の場合は、[「操作ログの確認と解析」](/guide/aws/service/audit.html#操作ログの確認と解析)を参考にしてください。
- *AWS Config Rule*からの通知の場合は、[「 構成変更ログの確認と解析」](/guide/aws/service/audit.html#構成変更ログの確認と解析)を参考にしてください。

**OrBIT管理者**では、AWSアカウントの利用目的、およびアラート種別を考慮した上で、プロジェクトへ連絡するか否かを決定します。その判断基準については、[「エスカレーションの可否判断」](#エスカレーションの可否判断)をご覧ください。

連絡が必要と判断した場合は、以下の方へEメールにて連絡を行います。
- **「プロジェクト責任者」** の役割を割り当てられた方
- **「セキュリティ担当者」** の役割を割り当てられた方

::: warning ATTENTION
プロジェクト側でアラートの受信設定をしている場合、同様のアラート内容に関して要因の調査依頼をお願いする場合があります。
:::

#### 3. 要因が判明したか否か
要因の調査を行った結果、その要因が判明しなかった場合、**OrBIT管理者**にご連絡ください。
調査の支援をさせて頂きます。

#### 4. 意図した操作か否か
要因が判明した場合、その要因が意図した操作であるかを確認します。
もし、意図した操作である場合は問題が無いと判断し、インシデントは解消されたものとします。
意図した操作でない場合は、対象のリソースが攻撃対象となっている可能性がありますので、その要因を取り除くための対策をする必要があります。

#### 5. 対応可能か否か
攻撃を受けている可能性がある以上、要因を取り除くため、迅速に対策を打つ必要があります。
要因の発生元に応じて、対策方法を検討してください。

- *Amazon GuardDuty*からの通知の場合は、[「脅威への対策」](/guide/aws/service/threat-detection.html#脅威への対策)を参考にしてください。
- *AWS CloudTrail*からの通知の場合は、[「操作ログの確認と解析」](/guide/aws/service/audit.html#操作ログの確認と解析)を参考にしてください。
- *AWS Config Rules*からの通知の場合は、[「構成変更ログの確認と解析」](/guide/aws/service/audit.html#構成変更ログの確認と解析)を参考にしてください。

もし、「対策手段が分からない」という場合は**OrBIT管理者**にご連絡ください。
対応方法に関して支援をさせて頂きます。

#### 6. リソースの修正
対応方法の内容、日時、リスク、手順などが決定したら、対象となるリソースの修正を行います。

::: danger IMPORTANT
OrBIT管理者では、[責任共有モデル](/guide/common/introduction.html#セキュリティ責任の共有)に準じ、プロジェクト側のリソースを操作する権限を持ちませんので、インシデント対策に関する実作業はできませんのでご理解ください。
:::

#### 7. インシデント解消
対象となるリソースに対して修正作業が終わった後は、その効果を確認します。
修正が適切ではない場合、しばらくした後、再度アラートが発行されますので[「1. アラート受信」](#_1-アラート受信)からやり直します。

### エスカレーションの可否判断
エスカレーションフローの[「2. 要因の調査」](#_2-要因の調査)で記載したように、**OrBIT管理者**では、プロジェクト側に通知されるものと同様の通知を受け取っており、インシデントが発生したAWSアカウントの利用目的、およびインシデントの重大性を考慮した上で、プロジェクトへエスカレーションするかを判断します。

各監視対象における、エスカレーションの可否は以下のマッピングに従って判断されます。
> :heavy_check_mark:がついている場合、エスカレーションを実施します。

- *Amazon GuardDuty*の検知結果

| 概念実証<br>開発環境<br>ステージング環境 | 本番環境 | 重要度 | 結果タイプ | 概要 |
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

- *AWS CloudTrail*のイベントログ

| 概念実証<br/>開発環境<br/>ステージング環境 | 本番環境 | アラート名 | 操作内容 |
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

- *AWS Config Rules*の評価結果

| 概念実証<br/>開発環境<br/>ステージング環境 | 本番環境 | ルール名 | 評価条件 |
| :----: | :----: | :---- | :---- |
| | :heavy_check_mark:    | orbit-DisallowSpecifiedPort         | ポート"22"または"3389"に対するSSHトラフィックが制限されていない |
| | :heavy_check_mark:    | orbit-VpcDefaultSecurityGroupClosed | デフォルトセキュリティグループに1つ以上のインバウンドまたはアウトバウンドトラフィックがある |
| | :heavy_check_mark: | orbit-VpcFlowLogsEnabled            | VPCフローログがVPCに対して無効 |
| | :heavy_check_mark: | orbit-AccessKeyRotated              | アクセスキーが90日を超えてローテートされていない |
| | :heavy_check_mark: | orbit-CMKBackingKeyRotationEnabled  | カスタマーマスターキーのローテーションが無効 |