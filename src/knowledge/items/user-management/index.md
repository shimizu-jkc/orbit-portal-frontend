# ユーザー認証と管理機能を実現するためのアーキテクチャ

<ScreenTransitionBtn btnName="戻る"/>

このナレッジでは、Webサービスにおける一般的なユーザ管理機能や認証機能の設計方法とリファレンスを提供します。 
リファレンスとして、以下のようなユーザー認証と管理機能をRestfulなAPIとして実装していますので、参考にしてください。

- サインイン/サインアウト
- サインアップ
- ユーザ登録(管理者登録)
- ユーザ情報の取得/検索
- ユーザ情報の更新
- ユーザの削除
- Eメールによる本人検証
- パスワードの設定/更新/再発行

:::: tabs cache-lifetime="0" :options="{ useUrlFragment: false }"
 
::: tab 概要
## 動作環境
本リファレンスを利用するためには、以下の環境が必要になります。

* Amazon Web Service(AWS)を利用していること。
* OrBITから払い出されたAWSアカウントであること。
* IAMリソースの作成権限を有するユーザアカウント、もしくはIAMロールが利用可能であること。

## 特記事項

#### 本人検証手段について
ユーザ本人の検証手段は**Eメール**のみをサポートします。  
SMSによる本人検証には対応していません。

#### リージョン制限について
本リファレンスは、現在下記のリージョンでのみ利用が可能です。  
* 米国東部 (バージニア北部) us-east-1
* 米国西部 (オレゴン) us-west-2
* アジアパシフィック (東京) ap-northeast-1

もし、他のリージョンで利用したい場合は、後述の **「ソースコードからデプロイする場合」** を選択頂くか、  
「問い合わせ先」までご連絡ください。  

#### データ整合性について
本リファレンスで提供されるユーザ管理機能は、すべての操作について「結果整合」となります。
 
## 未対応項目
本リファレンスでは現在、以下の項目に対応していません。  

* リファレンス内でのデータストア(DynamoDB、RDS等)の提供。
* ユーザ検索機能における、複数条件を指定する際の優先度表現。
* 非VPC環境へのLambda関数デプロイ。
* 同一AWSアカウントにおける本リファレンスの複数デプロイ。

## 作成者
未来創造研究所 先行技術検証グループ クラウド担当  清水
Email : shimizu.yusuke53@jvckenwood.com
:::

::: tab 使い方
## 利用手順
本リファレンスはAWSサービスの一つである、CloudFormationから利用することができます。  
また、ソースコードも公開していますので、AWS SAM CLIを使用したデプロイも可能です。  
ここでは、それぞれの方法について利用手順を説明します。  

### CloudFormationを利用する場合

1. 本リファレンスを利用したいAWS環境、およびリージョンにてCloud Formationコンソールを開きます。

2. Cloud Formationコンソールにて、**スタックの作成**をクリックし、**新しいリソースを使用(標準)** を選択します。

3. スタックの作成画面にて以下の通りに設定を行い、スタック作成の準備をします。

	* *テンプレートの準備*にて、**テンプレートの準備完了** を選択します。
	* *テンプレートソース*にて、**Amazon S3 URL**を選択します。
	* *Amazon S3 URL*に、利用したいバージョン、およびリージョンのCloudFormationテンプレートURLを入力します。  
		URLは[リリース一覧](https://github.com/jkc-cloud/orbit-catalog-UserManagement/releases)の各バージョンの詳細から確認して下さい。
		
4. スタックの詳細指定画面にて、必要な項目設定を行います。

	* *スタックの名前*に、任意のスタック名を入力します。
	* *パラメータ*に、本リファレンスを利用する際に必要な設定を入力します。  
		* 入力パラメータの詳細については後述します。
	
5. スタックオプションの設定画面にて、必要な項目を入力し、スタックの作成を行います。

	* オプションの設定に関しては、リファレンス利用者の任意になります。

6. レビュー画面にて設定項目を確認し、問題がなければスタックの作成を行います。

	> **注意** : 本リファレンスではIAMロールを作成するため、CloudFormationへのアクセス権付与の承認が必要となります。画面下部に承認を求めるダイアログが表示されている場合、承認を許可するチェックを付けてください。

### ソースコードからデプロイする場合

ソースコードからデプロイすることにより、以下の制限が解消されます。  

* 任意リージョンへのデプロイ。
* ソースコードのカスタマイズ。

1. Gitリポジトリからソースコード一式をクローンします。

2. ビルドしたアーティファクトの置き場となるS3バケットを作成します。

	```
	aws s3 mb s3://$YOUR_ARTIFACT_BUCKET
	```
	
3. ソースコードのルートディレクトリにて、以下のコマンドを実行します。

	```
	sam package --s3-bucket s3://$YOUR_ARTIFACT_BUCKET --s3-prefix $VERSION --output-template-file template-out.yml",
	```

4. ビルドに成功した場合は、デプロイの準備を行います。
	
	```
	sam deploy -t template-out.yml --guide
	```
	上記コマンドを実行すると、テンプレートに必要なパラメータが求められるので必要項目を入力します。  
	入力パラメータの詳細については後述します。
	> **注意** : CAPABILITY設定には、デフォルトの**CAPABILITY_IAM**ではなく、**CAPABILITY_NAMED_IAM**の指定が必要になります。
		
5. ビルドしたテンプレートファイルを元にデプロイを行います。

	```
	sam deploy -t template-out.yml
	```

いずれのデプロイ手順でも、スタックの状態が**CREATE_COMPLETE**になれば、デプロイは正常に完了です。  
もし、スタックの作成に失敗した際は、ロールバックが自動的に行われ、スタックの状態が**ROLLBACK_COMPLETE**になります。  
失敗した場合は、問い合わせ先までご連絡ください。


## 入力パラメータ
本リファレンスを利用する際には、ユーザに下記のパラメータ入力を要求しますので適宜設定をして下さい。

| パラメータ名 | 型 | NULL許容 | 内容 | デフォルト | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| CatalogName | 文字列 | × | リファレンス名| UserManagement | - |
| ProjectName | 文字列 | × | プロジェクト名| ProjectUseUserManagement | - |
| LogFilterLevel | 選択文字列 | × | 出力ログレベル\*1 | NONE | このレベル未満は出力されません |
| LogRetentionInDays | 選択式文字列 | × | ログ保持期間 | 365 | - |
| UseDbType | 選択文字列 | × | 使用するデータストア種別 | DynamoDB | RDS \*2  or DynamoDB |
| RdsSecretARN | 文字列 | 〇 | SecretsManagerのシークレットARN |  | RDS利用時のみ |
| RdsSecretKeyARN | 文字列 | 〇 | SecretsManagerのシークレット暗号化キーARN |  | 暗号化に独自CMKを使用している時のみ |
| DefaultUserName | 文字列 | 〇 | デフォルトユーザ名\*3 |  | 管理者用途 |
| DefaultUserEmailAddress | 文字列 | 〇 | デフォルトユーザのEメールアドレス |  | 検証コードが発行されます \*5 |
| Subnets | 選択文字列 | × \*4 | Lambdaを起動するサブネット設定 |  | 複数設定可 |
| SecurityGroups | 選択文字列 | × \*4 | Lambda起動時のセキュリティグループ |  | 複数設定可 |
| TracingEnabled | 選択文字列 | × | APIGatewayおよびLambdaのX-ray tracingの有効化| Disable | Enable or Disable |

> **\*1** ログレベルは優先度の高い順に、**PROHIBIT/FATAL/ERROR/WARN/INFO/DEBUG/NONE**になります。  
> **\*2** RDSを選択する場合、後述の要件に沿ったDBインスタンスを利用者側で用意する必要があります。  
> **\*3** デフォルトユーザが作成されるのはCognito UserPoolのみでデータストアには格納されません。  
> **\*4** 現在はVPC内での利用に限定しています。今後対応予定です。  
> **\*5** 検証コードを使用した本人認証の完了には下記の2種類があります。いずれかの方法で検証を完了してください。  
* *本リファレンスが提供するAPIで認証する*  
```
curl -X POST -H "x-api-key: $YOUR_APIKEY" -d "{\"user_id\":\"xxx\",\"tmp_password\":\"yyy\",\"new_password\":\"zzz\"}" $YOUR_APIGATEWAY_ENDPOINT/password/regist
```
* *AWS CLIで認証する*
	* [こちら](https://dev.classmethod.jp/cloud/aws/change-cognito-user-force_change_passwore-to-confirmed/)のページを参考にしてください。

### データストアにRDSを利用する場合
本リファレンスのデータストアにRDSを利用する場合、RDSおよびスキーマは利用者側で用意する必要があります。  
以下の手順に従って、利用するための設定を行ってください。  

1. RDS内任意のデータベースに下記要件を含むユーザ管理用テーブルを作成します。

| カラム名 | カラム内容 | キー/インデックス | 型 | NULL許容 |
| :--- | :--- | :--- | :--- | :--- |
| user_id | ユーザ識別子 | PK | 文字列(32) | × |
| alias_id | ユーザ識別子のエイリアス | UNIQ INDEX | 文字列(16) | × |
| email | Eメールアドレス | × | 文字列(64) | × |
| confirm_state | ユーザ登録状態 \*1 | × | 文字列(32) | × |
| created_at | ユーザ登録日時 | × | 符号なし整数(64) | × |
| updated_at | ユーザ更新日時 | × | 符号なし整数(64) | × |

> **\*1** ユーザ登録状態には、検証状態に応じて以下のいずれかの値を取ります。

| 状態名 | サインイン | 内容 |
| :--- | :--- | :--- |
| UNCONFIRMED | 不可 | 未認証状態。サインアップ直後に遷移する。|  
| FORCE_CHANGE_PASSWORD | 不可 | パスワード変更待ち状態。管理者登録直後に遷移する。|
| RESET_REQUIRED | 可 | パスワード確認待ち状態。パスワードリセット後に遷移する。|
| EMAIL_VERIFY_REQUIRED | 可 | Eメール未検証状態。Eメールアドレス更新後に遷移する。|
| CONFIRMED | 可	| 確認済み状態。|

2. AWS SecretsManagerに下記要件のシークレットを作成します。

> ※シークレット名は任意で構いません。

| シークレットキー | 値 | 備考 |
| :--- | :--- | :--- |
| username | DBアクセスにアクセス可能なユーザ名 | |
| password | 上記ユーザ名のパスワード | |
| engine | エンジン名 | 現在、mysqlのみサポート |
| host | ホスト名 | |
| host_replica | リードレプリカのホスト名 | レプリカを利用する時のみ |
| port | ポート番号 | |
| dbInstanceIdentifier | DBインスタンス名 | |
| dbname | ユーザテーブルの存在するDB名 | |
| userTableName | ユーザテーブル名 | |

3. AWS SecretsManagerのシークレット暗号化に独自CMKを利用する場合、キーポリシーを作成します。

シークレット作成時に独自CMKを利用して暗号化している場合は、復号のためLambda関数にアクセス許可を与える必要があります。  
以下のサンプルを参考にして、キーポリシーへの追加を行ってください。
```
{
	"Sid": "key policy sample",
	"Effect": "Allow",
	"Principal": {
		"AWS": [
			"arn:aws:iam::012345678910:role/UserManagement-user-lambdaRole *1"
		]
	},
	"Action": [
		"kms:Decrypt"
	],
	"Resource": "*",
	"Condition": {
		"StringEquals": {
			"kms:ViaService": [
				"lambda.us-east-1.amazonaws.com"
			]
		}
	}
}
```
> **\*1** パラメータ入力時にCatalogNameを変更している場合は、IAMロール名も関連して変わりますので、合わせてください。

## デプロイされるリソース一覧
本リファレンスでデプロイされるリソースは以下になります。  
各リソースの詳細については、CloudFormationコンソールにて確認してください。  
尚、表中の **$ProjectName** 等は各入力パラメータが展開された値となります。

| リソース種別 | リソース名 | 概要 | エクスポート名 |
| :--- | :--- | :--- | :--- |
| Cognito::UserPool | $ProjectName | ユーザプール | UserPoolId: 物理ID <br> UserPoolArn: ARN |
| Cognito::UserPoolClient | $CatalogName | ユーザプールクライアント | - |
| Cognito::UserPoolUser | $DefaultUserName | デフォルトユーザ名\*1\ | - |
| ApiGateway::RestApi | UserManagementAPI | API | - |
| ApiGateway::Stage | v1 | APIデプロイメントステージ | - |
| ApiGateway::ApiKey | $CatalogName | API認証用キー | - |
| ApiGateway::UsagePlan | AuthLambdaRole | 使用料プラン | - |
| ApiGateway::UsagePlanKey | $CatalogName | 使用料プラン関連キー | - |
| IAM::Role | AuthLambdaRole | 認証コンポーネント用IAMロール | - |
| Lambda::Function | $CatalogName-auth-xxx | 認証コンポーネント用Lambda | - |
| Logs::LogGroup | /aws/lambda/$CatalogName-auth-xxx | 認証コンポーネント用ロググループ | - |
| IAM::Role | UserLambdaRole | ユーザ管理コンポーネント用IAMロール | - |
| Lambda::Function | $CatalogName-user-xxx | ユーザ管理コンポーネント用Lambda | - |
| Logs::LogGroup | /aws/lambda/$CatalogName-user-xxx | ユーザ管理コンポーネント用ロググループ | - |
| Lambda::LayerVersion | $CatalogName-NodeModuleLayer | Lambda用NodeModule格納レイヤ | - |
:::

::: tab アーキテクチャ
<CaptionedImage src="usermanagement_architecture.png" />
:::

::: tab API仕様
<!-- <ExternalApiSpec url="https://s3-ap-northeast-1.amazonaws.com/ap-northeast-1.usermanagement.orbit-catalog.artifact/v0.9.8/html/api.html" /> -->
<ExternalApiSpec url="/doc/api-user-management.html" />
:::

::: tab ダウンロード
[こちら](https://github.com/jkc-cloud/orbit-catalog-UserManagement)でソースコードを公開しています。

<!--
| バージョン | 提供形式 | 対応リージョン | リンク | 
| :--- | :--- | :--- | :--- |
| v0.9.8 | CloudFormationテンプレート | バージニア北部 | [ダウンロード](https://s3.amazonaws.com/us-east-1.usermanagement.orbit-catalog.artifact/v0.9.8/UserManagementCatalogTemplate.yml) |
| v0.9.8 | CloudFormationテンプレート | オレゴン | [ダウンロード](https://s3-us-west-2.amazonaws.com/us-west-2.usermanagement.orbit-catalog.artifact/v0.9.8/UserManagementCatalogTemplate.yml) |
| v0.9.8 | CloudFormationテンプレート | 東京 | [ダウンロード](https://s3-ap-northeast-1.amazonaws.com/ap-northeast-1.usermanagement.orbit-catalog.artifact/v0.9.8/UserManagementCatalogTemplate.yml) |
-->
:::

::: tab リリースノート
リリースノートは[こちら](https://github.com/jkc-cloud/orbit-catalog-UserManagement/releases)をご覧ください。

<!--
## v0.9.8 (2020/4/28) <Badge text="最新" type="tips"/><Badge text="LTS" type="note"/>
- Issue #23 対応
  - エラーレスポンスを適切な形に修正しました。

## v0.9.7 (2020/4/24)
- Issue #12 #19 #20 #21  対応
  - 各状態におけるエラーレスポンスを適切な形に修正しました。
  - 仕様に合わせてAPI仕様書を更新しました。

- API仕様書を更新しました。
```
@@ 693
  - 最小8文字~最大99文字
  + 8文字以上である
@@ 1061
  - pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-/:-@[-`{-~])[!-~]{8,99}$/u
  + pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{8,}$/
@@ 1065 
  - pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-/:-@[-`{-~])[!-~]{8,99}$/u
  + pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{8,}$/
@@ 1070
  - pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-/:-@[-`{-~])[!-~]{8,99}$/u
  + pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{8,}$/
@@ 1111
  パスワード確認待ち状態(RESET_REQUIRED)  
  - パスワードリセット後に遷移。サインイン可。
  + パスワードリセット後に遷移。サインイン不可。
```
-->
:::

::: tab ヒント
## Terraformからデプロイする
Terraformから本リファレンスをデプロイする際は、**aws_cloudformation_stack**のリソースを使用します。  
以下を参考にして、適切な設定をして下さい。  

```
resource "aws_cloudformation_stack" "user_management" {
  name         = "UserManagementStack"
  template_url = "https://s3.amazonaws.com/${var.region}.usermanagement.orbit-catalog.artifact/${var.release_version}/UserManagementCatalogTemplate.yml"  
	capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM", "CAPABILITY_AUTO_EXPAND"]  
	parameters = {
    ProjectName             = var.project
    LogFilterLevel          = var.log_filter_level
    LogRetentionInDays      = var.log_retention
    UseDbType               = var.use_db_type
    RdsSecretARN            = var.RdsSecretARN
    DefaultUserName         = var.default_username
    DefaultUserEmailAddress = var.default_useremail
    Subnets                 = "${data.aws_subnet.prv-AZ-a.id},${data.aws_subnet.prv-AZ-b.id},${data.aws_subnet.prv-AZ-c.id}"
    SecurityGroups          = data.aws_security_groups.lambda_sg.ids[0]
  }
```
:::

::::
<Footer/>