# ユーザーID管理サービス

AWSアカウントを作成したとしても、そこにアクセスが可能なユーザーを作成しない限り、AWSサービスを利用することはできません。
しかし、ユーザーはただ作ればいいという訳ではなく、「そのユーザーにどのような権限を与えるか」、「そのユーザーのIDをどう守るのか」といった点を考慮する必要があります。
これは一般的に[「IAMのベストプラクティス」](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html)に沿って、ユーザー登録や設定を進めれば問題ありませんが、AWSの利用に不慣れな方には大きな負担となります。

また、AWSアカウントは携わるプロジェクトが増えたり、利用目的によっては段々と増えていきがちです。そうなると、「どのアカウントがどのプロジェクトなのか」、「このアカウントのアクセス権限はどうなっていたか」といった点を管理する必要が出てきます。
AWSアカウントへのアクセスURLは、一般的にブックマークとして管理され、煩雑になりがちです。アカウント毎に異なるIDを使用してる場合は、それらの管理も必要になってきます。

OrBITでは、ユーザーIDを一元的に管理することでプロジェクトの運用負荷を削減します。
また、そのユーザーがアクセスできるAWSアカウントを一覧で確認可能なポータル画面を提供することで、煩雑なブックマークの管理に悩まされることは無くなります。

[[toc]]

## 利用するAWSサービス

- ***AWS Single Sign-On (AWS SSO)***

  複数のAWSアカウントとビジネスアプリケーションへのアクセスを一元管理できるようになり、すべての割り当て済みアカウントとアプリケーションに対して、シングルサインオンを可能にするサービスです。 
  組織管理と連携することで、統合的なユーザー管理とアクセス権限管理を行うことができるようになります。

  詳細は以下を参照してください。
  - [「AWS Single Sign-On ユーザーガイド」](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html)
 
  ::: tip INFO
  *AWS SSO*の利用に料金はかかりません。
  :::

## 用語定義
本章で使用する用語は以下のように定義します。

| 用語 | 意味 |
| :---: | :---: |
| SSO | OrBITで提供するシングルサインオンサービスの名称 |
| SSOポータル | SSOを利用するためのポータルサイトの名称 |
| SSOユーザー | OrBITにて管理されるSSO利用ユーザーの総称 |
| IAMユーザー | プロジェクトで任意に作成・管理するユーザーの総称 |

## AWSアカウントへのアクセス手段
一般的に、AWSアカウントを作成した後は[「IAMのベストプラクティス」](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html)に沿って、IAMユーザーの作成や設定を進めれば問題ありませんが、以降の運用も含めると管理者にはある程度のIAMに関する知識と経験が必要になってきます。

そこで、OrBITでは*AWS SSO*を使った、シングルサインオンサービスを提供しています。

SSOを利用すると、以下のようなポータル画面が提供され、ユーザーが所属するAWSアカウントと割り当てられたアクセス権限の確認、およびアクセスを行うことができます。

<CaptionedImage src="sso_portal.png" />

この例の場合、ユーザーは`TestProject dev`,`TestProject2 dev`,`TestProject3 dev`の3つのAWSアカウントに所属しています。また、`TestProject dev`のAWSアカウントには、`AdministratorAccess`権限でアクセスが可能です。

::: tip INFO
実際のポータル画面には、AWSアカウントのアカウントIDとルートユーザのEメールアドレスも表示されます。
このEメールアドレスはプロジェクト側でご利用頂くことも可能です。詳細は[「ルートユーザーのEメールアドレス」](/guide/aws/service/account-management.html#ルートユーザーのeメールアドレス)を参照して下さい。
:::

## IAMユーザーとの関係
もしプロジェクト内に、IAMユーザーに関する知識や運用経験があるユーザーがいる場合は、SSOを利用せずにIAMで管理することも可能です。

SSOユーザーを利用した場合とIAMユーザーを利用した場合の比較については以下にまとめています。
プロジェクト側でどちらを利用するか決める際に参考にしてください。

IAMユーザーを利用する場合、本章の内容はスキップして構いません。

| 項目 | SSOユーザー | IAMユーザー |　
| :---: | :---: | :---: |
| 運用主体 | OrBIT管理者 | プロジェクト |
| セキュリティ責任の所在 | OrBIT管理者 | プロジェクト |
| セキュリティポリシーへの準拠 | 透過的に準拠 | 意識的に準拠が必要*1 |
| ユーザーに関連した作業 | OrBIT管理者に申請が必要 | 自由に変更可能 |
| アクセス権限<br>(IAMポリシー) | 決められた役割から選択*2 |  自由に変更可能 |

*1 セキュリティポリシーからの逸脱検知などの最低限の準拠する仕組みは提供します。
*2 役割に対して権限が足りない場合は、問い合わせて頂ければ対応します。

::: tip NOTE
SSOユーザーとIAMユーザーのハイブリッド運用も可能です。

例えば、マネジメントコンソールへのログインはSSOユーザーで管理し、SaaSなどAWS外からのアクセスに関してはIAMユーザーのクレデンシャルを利用する、といった運用は良く使われています。
:::

## SSOポータル
SSOを利用すると、ユーザーが所属しているAWSアカウント、および割り当てられたアクセス権限をポータル画面にて一覧で確認し、アカウントへアクセスすることが可能です。

このポータル画面を**SSOポータル**と呼びます。
> 本サイト([OrBITポータル](/guide/common/introduction.html#_3-orbitポータル))とは異なりますのでご注意ください。

SSOポータルへは以下からアクセスすることが可能です。
[https://orbit-jkc.awsapps.com/start/](https://orbit-jkc.awsapps.com/start/)

::: warning ATTENTION
SSOポータルへのログインには、事前にOrBIT管理者へのユーザー登録申請が必要です。
:::

### 招待メール
---
SSOユーザーの登録が完了すると、指定したEメールアドレスに以下のような招待メールが届きますので、メール本文の **[Accept Invitation]** をクリックしてパスワード登録を行ってください。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/aws-sso-owndir-031.png)

::: warning ATTENTION
招待メールの期限は7日間です。
もし期限を過ぎてしまった場合は、[問い合わせ窓口](/support/contact.html)よりお問い合わせください。
:::

### パスワードポリシー
---
SSOユーザーのログインパスワードはセキュリティポリシーに準拠するため、以下のパスワードポリシーを適用しています。

- **8** ～ **64** 文字以内であること
- **英小文字**を最低1文字は含むこと
- **英大文字**を最低1文字は含むこと
- **数字**を最低1文字は含むこと
- **特殊文字**を最低1文字は含むこと


### 2段階認証
---
SSOポータルへのログインには、Eメールベースの2段階認証を適用しています。
はじめて、もしくはログイン環境が変わった際、SSOポータルへログインしようとすると、以下のようなダイアログが表示される場合があります。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2019/08/aws-sso-2step-verification-6-320x457.jpg)

このダイアログが表示されると共に、ユーザー登録時に指定したEメールアドレスへ、以下のような検証コードを記載したメールが送信されます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2019/08/aws-sso-2step-verification-5-640x506.jpg)

この検証コードをダイアログに入力することで、本人であると認証されて各AWSアカウントへのアクセスが可能になります。

::: warning ATTENTION
初回の2段階認証時にデバイスを信頼しておくと、以降はそのデバイスからのログイン時には2段階認証をスキップすることができます。
しかし、ログインするデバイスや場所が通常と異なる場合は再度、同認証が必要になります。
:::

## SSOユーザー
SSOユーザーはOrBITで管理されるため、プロジェクトの運用工数を削減することができます。
IAMに関する深い知識が無くても、OrBITが提供するフレームワークに沿うことで、一般的かつセキュアな運用をすぐに始めることができます。

ただし、IAMに関して、ある程度の知識がある場合や、細かくポリシー制御を行いたい場合は、各種申請にオーバーヘッドが掛かってしまいますので、その場合はIAMユーザーの利用を推奨します。

### 役割の一覧
---
SSOユーザーには、ユーザー登録の申請をする際に、最低1つ以上の役割を割り当てる必要があります。この役割は、OrBITによって定義されたクラウドを利用する上で必要となる一般的な職務であり、以下の種類があります。

| 役割名称 | 説明 |
| :--- | :--- |
| クラウド環境責任者 | AWSアカウントにおける責任者です。必ず1人割り当てる必要があります。|
| 請求管理者 | 利用料金や請求内容を確認し、コストを把握・管理します。| 
| セキュリティ担当者 | インシデント発生時の対策やエスカレーション時の窓口となります。|
| 特権運用者 | サービスにおける緊急的な運用を行います。|
| 運用者 | サービスにおける定常的な運用を行います。|
| データベース管理者 | データベースの開発や運用を行います。|
| 特権開発者 | サービスの開発を主導し、管理を行ないます。| 
| 開発者 | サービスの開発を行います。 |
| データ解析者(申請ページで選択できないが問題ない？) | 蓄積したデータの確認や解析を行います。 |
| ゲスト | プロジェクトの直接的ではない関係者です。|

::: tip NOTE
OrBITの実運用が進むにつれ、役割は変更される可能性があります。
:::

### アクセス権限の一覧
---
SSOユーザーがAWSアカウントへアクセスするためには、ユーザーの登録と同時に、アクセス権限を付与する必要があります。

OrBITでは以下のアクセス権限を用意しており、役割や用途に応じて、いずれかの権限が1つ以上付与されます。また、各アクセス権限にはセッション時間が設けられており、その上限を超えた場合は再度ログインが必要になります。

各アクセス権限の詳細なポリシーについてリンク先をご確認ください。
リンクを開く際は、いずれかのAWSアカウントへログインし、マネジメントコンソールを開いた状態にしておいてください。

| アクセス権限名称 | セッション<br>(単位:時間) | 内容 |
| :--- | :---: | :--- |
| [AdministratorAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/AdministratorAccess)	| 1 | フルアクセスの許可 |
| [BillingAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/Billing)	| 1 | 利用料金・請求情報へのアクセス許可 |
| [DBManagerAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/DatabaseAdministrator) | 1 | 一連のDBサービスへのアクセス許可 |
| [DataAnalystAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/DataScientist)	| 1 |  一連のデータ解析サービスへのアクセス許可 |
| [NetworkManagerAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/NetworkAdministrator) | 1 | ネットワーク関連リソースへのアクセス許可 |
| [PowerUserAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/PowerUserAccess)	| 12 | アプリ開発に必要なサービスへのアクセス許可 |
| [ReadOnlyAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/ViewOnlyAccess) | 1 | 閲覧専用のアクセス権限 | 
| [SecurityAuditorAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/SecurityAudit)	| 1 | セキュリティ監査に関するサービスへのアクセス許可 | |
| [SupportUserAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/SupportUser)	| 1 | AWSサポートへのアクセス許可 | |
| [SystemManagerAccess](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/job-function/SystemAdministrator)	| 1 | システム管理に関するサービスへのアクセス許可 |
| XXXFullAccess	| 1 |特定サービスへのフルアクセスの許可 |
| XXXProgrammaticAccess | ANY*1 | プログラムやコマンドからの特定サービスへの許可 |

*1 サービスによってセッション時間が異なります。

::: tip NOTE
OrBITの実運用が進むにつれ、アクセス権限は変更される可能性があります。
:::

### 役割とアクセス権限のマッピング
---
各SSOユーザーは、少なくとも1つ以上の役割が割り当てられており、その役割毎にアクセス権限が付与されます。
また、AWSアカウントの利用目的によっては、一部の役割を割り当てることができません。詳細は以下の表を参照してください。

| 役割 | 付与されるアクセス権限 | 概念実証<br>開発環境 | ステージング環境<br>本番環境 |
| :---: | :---: | :---: | :---: |
| クラウド環境責任者 | AdministratorAccess | :heavy_check_mark: | :heavy_check_mark: |
| コスト管理者	| BillingAccess | :heavy_check_mark: | :heavy_check_mark: |
| セキュリティ担当者 | SecurityAuditorAccess | :heavy_check_mark: | :heavy_check_mark: |
| 特権運用者	| AdministratorAccess | | :heavy_check_mark: |
| 運用者 | SystemManagerAccess<br>NetworkManagerAccess | | :heavy_check_mark: |
| データベース管理者 | DBManagerAccess | :heavy_check_mark: | :heavy_check_mark: |
| 特権開発者 | AdministratorAccess | :heavy_check_mark: | |
| 開発者 | PowerUserAccess | :heavy_check_mark: |  |
| データ解析者 | DataAnalystAccess | :heavy_check_mark: | :heavy_check_mark: |
| ゲスト | ReadOnlyAccess | :heavy_check_mark: | :heavy_check_mark: |
|  - | - | - |
| OrBIT管理者*1 | SecurityAuditorAccess | :heavy_check_mark: | :heavy_check_mark: |

*1 OrBIT管理者では、インシデントの発生時に要因の調査や解析を支援することがあるため、すべてのプロジェクトに対して`SecurityAuditorAccess`を持ちます。詳細は[「セキュリティエスカレーション」](/guide/aws/service/monitoring.html#セキュリティエスカレーション)をご覧ください。

### 各種申請
---
SSOユーザーの登録、削除、役割の変更を行う際の手順については、[利用手順](/guide/aws/usecase/user-management.html)をご覧ください。

## ユーザーIDの棚卸
OrBITでは、定期的にSSOを利用しているすべてのAWSアカウントに対して、下記要件にてユーザーIDの棚卸をお願いしています。ユーザーIDの棚卸は、不要な認証情報の流出を防ぐためにも重要ですので、ご協力をお願いします。

| 項目 | 内容 |
| :---: | :--- |
| 対象 | SSOを利用するすべてのAWSアカウント |
| 実施時期 | 9月末 / 毎年 |
| 依頼先 | クラウド環境責任者 |
| 依頼手段 | Eメールアドレス |
| 添付資料 | SSOユーザー、およびアクセス権限の一覧 |
| 依頼内容 | 不要なSSOユーザーがいないかの確認<br>意図していないアクセス権限が割り当てられていないかの確認 |

::: warning ATTENTION
IAMユーザーに関しては棚卸対象ではありませんが、定期的にユーザーのIDを確認することは非常に重要ですので、同程度の頻度でIAMユーザーも棚卸することを推奨します。
:::

## チュートリアル

### SSOポータルから一時クレデンシャルを取得する
プログラムやコマンドからAWSサービスへアクセスする際には、クレデンシャルとしてアクセスキー、およびシークレットアクセスキーのペアが必要になります。一般的にクレデンシャルはIAMユーザー作成時に払い出されますが、SSOを利用している場合は、SSOポータルから取得することができます。

ここでは、SSOポータルから一時的なクレデンシャルを取得する方法を紹介します。

:::danger IMPORTANT
SSOポータルから取得した一時クレデンシャルには、[アクセス権限](#アクセス権限の一覧)に応じたセッション時間の上限があります。永続的なクレデンシャルを利用したい場合は、IAMユーザーを作成してクレデンシャルを払い出してください。
:::

#### 1. SSOポータルへログインし、ポータル画面を表示します。

<CaptionedImage src="sso_portal.png" />

#### 2. アクセスしたいアカウントを展開し、 **Command line and programmatic access**と書いてあるリンクをクリックします。

<CaptionedImage src="sso_portal_cred.png" />

#### 3. 以下の画面が表示されますので、環境と用途に合わせてクレデンシャルをコピーします。
![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/0044-640x560.png)

#### 4. 用途に応じて、適切にクレデンシャルを設定します。

- 環境変数の場合
```
export AWS_ACCESS_KEY_ID="xxxxxxxxxxxxxxxxxxxxxxxx"
export AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export AWS_SESSION_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

- 認証情報ファイルの場合

  ~/.aws/credentialsに以下のテキストを追記します。
  > プロファイルは必要に応じて分けてください。詳細は[こちら](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-profiles.html)を参照して下さい。
```
[default]
aws_access_key_id = XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
aws_session_token = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### 5. クレデンシャルが適切に設定できているかを確認します。 
```
aws sts get-caller-identity

{
    "Account": "xxxxxxxxxxxx",
    "UserId": "XXXXXXXXXXXXXXXXXXXXX:(Domain user name)@(Domain name)",
    "Arn": "arn:aws:sts::xxxxxxxxxxxx:assumed-role/AWSReservedSSO_AdministratorAccess_xxxxxxxxxxxxxxxx/(Domain user name)@(Domain name)"
}
```

これでこのチュートリアルは終了です。