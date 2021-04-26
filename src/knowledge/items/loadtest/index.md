# クラウド上で実行可能な負荷試験ツール

<ScreenTransitionBtn btnName="戻る" />

一般的に、設計したシステムに対して大量のアクセスを行い、システムに負荷をかける試験のことを負荷試験と呼びます。
負荷試験では、主に以下の目的を達成するために実施されます。

- システムの負荷テスト
- システムのボトルネックの把握とパフォーマンスの改善
- スケールが自動変化するシステムにおけるアクセス増減によるスケール変化の確認

しかし、負荷試験をローカル端末を使用して実施する場合、大量のリソースが必要になることがあります。
このナレッジでは、この負荷試験をAWS上で実行するための手順とツールを紹介しています。

:::: tabs cache-lifetime="0" :options="{ useUrlFragment: false }"
 
::: tab 概要

## 必要環境

##### スクリプト実行環境(本スクリプトを実行する場所)

- Linux系OS
- 以下の2つがインストールされていること
    - git
    - python3

##### AWSアカウント

- OrBITから払い出されたAWSアカウントであること
- VPCがあること
- Publicのサブネットが2つ以上、Privateのサブネットが1つ以上があること（ただしNAT Gatewayは不要）
- AWS環境のAdministrator権限のあるIAMユーザー or SSOユーザーがあること
- (スクリプト実行環境<->AWSアカウント間でSSL通信を使う場合) アカウント内にホストゾーンが存在すること

##### 負荷試験の対象

- AWSアカウントからアクセスできること(IPアドレスの制限などにより、アクセスが制限されていないこと)

___

## 対応コマンド一覧

- 使い方

```shell
$ cd loadtest/script/
$ python3 app.py COMMNAD [-f/--filemng]
```

```shell
# 例
$ python3 app.py init
$ python3 app.py deploy
$ python3 app.py undeploy --filemng
```

| COMMNAD  |                                  用途                                  |
| -------- | ---------------------------------------------------------------------- |
| init     | 初めて使うときの環境整備                                               |
| deploy   | 試験環境を作成 (-f/--filemng のオプション付与でファイルマネージャ作成) |
| start    | シナリオファイルで試験開始                                             |
| stop     | 動作中の試験を中止                                                     |
| undeploy | 試験環境を削除 (-f/--filemng のオプション付与でファイルマネージャ削除) |
| archive  | 結果ファイルをダウンロード                                             |
| term     | アップロードしたファイルも含め、全て削除 (プロジェクト終了時など)      |

:::
 
::: tab 使い方

## ファイル構成

```javascript
// スクリプト実行環境
work_root(loadtest)
├ container
│   └ jmeter/               // jmeterコンテナ
├ doc                   // ドキュメント
├ load-test-cdk         // ソース
├ input                 // シナリオファイル置き場
├ output                // 結果ファイルダウンロード先
├ script                // 環境構築スクリプト
│  ├ app.py             // メインスクリプト
│  ├ config.toml            // 環境設定ファイル
│  ├ container.toml         // (編集不可) コンテナリンク集
│  ├ deployList.toml        // (編集不可) デプロイ済みオブジェクトのリスト
│  ├ init_template.yaml     // (編集不可) 初期環境のCfnテンプレート
│  ├ requirements.txt       // (編集不可) pythonモジュールリスト
│  └ scale_config.toml      // スケール設定ファイル
└ README.md             // 説明書
```

## 環境整備

1. __ファイル一式をクローンする__

```shell
$ git clone https://github.com/jkc-cloud/orbit-catalog-LoadTest ./loadtest
```

2. __pip3で必要なpythonモジュールをインストール__

```shell
$ cd loadtest/script/
$ pip3 install -r requirements.txt
```

3. __初期設定の入力__

`config.toml`を開き、以下の項目を入力する
- VPCのID：vpcId
- サブネットのID3種：public1_SubnetId/public2_SubnetId/private1_SubnetId
    - ※public1_SubnetId/private1_SubnetIdは同じAZ(availability zone)にしてください。
    - ※public1_SubnetId/public2_SubnetIdは異なるAZにしてください。
- (SSL通信を使う場合) ホストゾーンのID：hostZoneId

```toml
# config.toml
vpcId = "vpc-05066b63dc4502148"

public1_SubnetId = "subnet-027f9dc07f6e3cce5"
public2_SubnetId = "subnet-0327abb145a86f13b"
private1_SubnetId = "subnet-0b0aae7eeb31be689"

hostZoneId = "Z07271101EECUVDAC6H0"
```

4. __初期環境構築__

環境に必要なものを作成する。

```shell
$ python3 app.py init
```

`initialize Finish!` が表示されたら環境の作成が完了。

- もし、エラーが出る場合
    - VPCのリージョンと`python3 app.py init`時に表示されるリージョンが同じであることを確認してください
    - VPCの中にSubnetがあることを確認してください
    - ホストゾーンが負荷試験環境と同じアカウントにあることを確認してください。

## 試験実施

1. __シナリオファイルのコピー__

負荷試験に使用するシナリオファイルを`input`フォルダの中に入れる。

```javascript
// スクリプト実行環境
// 例
├ input             // シナリオ用フォルダ
│  ├ scenario1.jmx
│  └ scenario2.jmx
```

- シナリオファイルの制約

ファイル名について、半角英数字以外の文字列は全て"_"への置き換えが発生します。そのため、日本語で構成されたファイルは動作しない場合があります。
可能な限り、半角英数字でファイル名を構成してください。

```javascript
// スクリプト実行環境

// NG
├ input
│  ├ シナリオ１.jmx
│  └ シナリオ２.jmx

// OK
├ input
│  ├ scenario1.jmx
│  └ scenario2.jmx
```

2. __試験タイプの設定__

`config.toml`を開き、使用する試験クライアントを設定できる。

```toml
# config.toml
type = "jmeter-5.2.1-mqtt-dev"
```

現在設定できる値は以下の通り。

- jmeter-5.2.1-mqtt         ※準備中
- jmeter-5.2.1-mqtt-dev     ※当面の間こちら。リリース後に削除予定

3. __試験規模(スケール)の設定__

`scale_config.toml`を開き、各シナリオファイル毎にCPUとメモリを設定する。

```toml
# scale_config.toml
# 入力例
[[scales]]
filename = "scenario1.jmx"
master_cpu = 256
master_mem = 512

[[scales]]
filename = "scenario2.jmx"
master_cpu = 1024
master_mem = 2048
```

`master_cpu`と`master_mem`に入力する値の有効値については、[CPUとメモリの有効値](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-cpu-memory-error.html)を参照してください。

4. __試験環境のデプロイ__

負荷試験を実施するサーバを作成する。

```shell
$ python3 app.py deploy
```

`deploy Finish!` が表示されたら試験環境の作成は完了。

5. __試験の開始__

負荷試験を実施する。

```shell
$ python3 app.py start
```

6. __試験の停止__

負荷試験を中止する。途中までの結果ファイルが生成される。

```shell
$ python3 app.py stop
```

7. __試験結果ファイルのダウンロード__

負荷試験の結果ファイルをスクリプト実行環境にダウンロードする。
ダウンロード先は`output/YYYYMMDD_hhmm`になる。

```shell
$ python3 app.py archive
```

- 例

```javascript
// スクリプト実行環境
├ output                     // 結果フォルダ
│  └ 20200427_0924
│     ├ scenario1.csv
│     └ scenario2.csv
```

※ダウンロードは直前に試験した結果ファイルのみになります。過去の結果を遡りたい場合は、ファイルマネージャの`output`フォルダから参照してください。

8. __試験環境の削除__

負荷試験を実施するサーバを削除する。

```shell
$ python3 app.py undeploy
```

`undeploy Finish!` が表示されたら試験環境の削除は完了。

___

## ファイルマネージャ機能

ファイルマネージャを利用して、試験環境にシナリオ以外のファイルを追加できる。（証明書、設定ファイルなど）

##### ファイルマネージャの起動

```shell
$ python3 app.py deploy -f
```

`filemng link: http://ip.adress:port`が表示されたらファイルマネージャの作成は完了。
リンクをクリックすることで、負荷試験環境にアクセスできる。

##### ユーザー名、パスワードの設定

ファイルマネージャにアクセスするためのユーザー名、パスワードはデプロイ時に表示される。パスワードはランダムパスワードを生成する。

```shell
filemng user: user
filemng pass: iVagx0F5VffiW
```

カスタムでユーザー名、パスワードを設定したい場合、`config.toml`で設定できる。

```toml
# config.toml
[filemng]
user = "my_new_user"
password = "my_new_password"    # ランダムパスワードに戻したい場合は、"" にする
```

##### ファイル構成

ファイルマネージャで、負荷試験環境で使うファイルをアップロードできる。

```javascript
// ファイルマネージャ
root  //環境変数: HOME_DIR
├ output        // (予約) 結果フォルダ
└ (自由にファイル/フォルダを作成可)
```

```javascript
// ファイルマネージャ
// 構成例
root
├ output        // (予約) 結果フォルダ
├ my_folder
│ ├ my_file1.txt
│ └ my_file2.csv
└ my_file3.md
```

##### jmeterで使用する場合

シナリオファイルにて、`HOME_DIR`を指定することで、ファイルマネージャ内のファイルを参照することができる。

jmeterの入力例：`${__P(HOME_DIR)}/my_folder/myfile1.txt`

##### ファイルマネージャの停止

```shell
$ python3 app.py undeploy -f
```

`undeploy Finish!`が表示されたらファイルマネージャの停止は完了。

※ファイルマネージャを停止しても、ファイルマネージャで作成したフォルダおよびファイルは維持され、負荷試験で使用できます。

## 全環境の削除

```shell
$ python3 app.py term
```

- 注: ファイルマネージャ内のファイルが全て削除されます。必要なファイルは適宜ローカルへダウンロードしてください。

`terminate Finish!`が表示されたら、全ての環境の削除は完了。

## 注意点

- 負荷試験環境は1つのAWS環境につき1つしか生成できません。
- スケールの変更(scale_config.tomlの変更)は、一度`undeploy`した後に`deploy`することで適用されます。

:::

::: tab アーキテクチャ

## 全体のアーキテクチャ

<CaptionedImage src="loadtest-architecture.png" />

___

## コマンド毎のアーキテクチャ

### init/terminate

- init
    - "load-test"スタック作成/スタックを構成するリソースの作成
    - 証明書/ドメイン検証用レコード作成
- terminate
    - S3内のオブジェクト/ファイル削除
    - 証明書/ドメイン検証用レコードの削除
    - "load-test"スタック削除/スタックを構成するリソースの削除

<CaptionedImage src="loadtest-architecture_init.png" />


### deploy/undeploy

- deploy
    - ELB/NAT Gateway作成
    - HostZoneにサブドメインを作成し、ELBに割り当てる
    - PrivateSubnetにNATGatewayへのルート作成
    - (シナリオファイル毎) ECSタスク定義/ECSサービス作成
- undeploy
    - (シナリオファイル毎) ECSタスク定義/ECSサービス削除
    - PrivateSubnetにNATGatewayへのルート削除
    - HostZoneのサブドメインを削除する
    - ELB/NAT Gateway削除

<CaptionedImage src="loadtest-architecture_deploy.png" />


### start/stop

- start
    - タスク全てに試験開始を要求
    - 試験の完了/停止時に結果ファイルを出力
- stop
    - タスク全てに試験の停止を要求

<CaptionedImage src="loadtest-architecture_start.png" />

### archive

- archive
	- S3バケットに出力された結果ファイルをクライアントにダウンロードする

<CaptionedImage src="loadtest-architecture_archive.png" />

:::

::: tab ダウンロード
[こちら](https://github.com/jkc-cloud/orbit-catalog-LoadTest)でソースコードを公開しています。

<!-- 
| バージョン | 提供形式 | 対応リージョン | リンク |
| :--- | :--- | :--- | :--- |
| v0.2.0 | スクリプト | ほぼ全てのリージョン* | [ダウンロード](https://github.com/jkc-cloud/orbit-catalog-LoadTest/releases/tag/v0.2.0) |
| v0.1.0 | スクリプト | ほぼ全てのリージョン* | [ダウンロード](https://github.com/jkc-cloud/orbit-catalog-LoadTest/releases/tag/v0.1.0) |

*Fargate/EFSが非対応なリージョンでは動作しません。（ごく一部のリージョンのみ）
-->

:::

::: tab リリースノート
リリースノートは[こちら](https://github.com/jkc-cloud/orbit-catalog-LoadTest/releases)をご覧ください。

<!--
## v0.2.0 (2020/8/24) <Badge text="最新" type="tips"/><Badge text="LTS" type="note"/>

v0.1.0から下記の改良をし、問題を解消しました。
- 負荷試験環境のメモリ使用量/使用率を測定できるようになりました。
- 負荷試験環境⇔スクリプト実行クライアント間をHTTP/HTTPSのいずれかを使用して通信できるようになりました。（HTTPSは要ホストゾーン)

## v0.1.0 (2020/7/7)

- 安定版

いくつかの問題を抱えています。
- 負荷試験環境のメモリ使用量/使用率を正確に把握できない
- HTTPS化できないため、セキュアな通信を実現できない
-->

:::

::: tab ヒント

### 発生する料金について

- 負荷試験の実行はAWS ECSのFargate、データ等の保存はS3とEFSを使用しています。
- コマンド`init`～`term`までの間、以下の料金が恒常的に発生します。
    - S3およびEFSに保存されているファイル容量分
- コマンド`deploy`～`undeploy`までの間、以下の料金が恒常的に発生します。
    - 負荷試験環境およびファイルマネージャのFargateコンテナ規模
        - Fargateの料金例：
            - Fargate：1.0vCPU、4GBメモリ、1日使用：185円
            - データ転送量(アウト) 20GB：230円
            - 計415円
        - Fargateの料金概算：[Fargateの料金計算](https://aws-rough.cc/fargate/)
    - 上記Fargateコンテナ数分のCloudWatch Logs, CloudWatchメトリクス(CPU/メモリ)
    - Application Load Balancer1つ、NATGateway1つ

##### 各種料金形態

- [S3の料金](https://aws.amazon.com/jp/fargate/pricing/)、[EFSの料金](https://aws.amazon.com/jp/efs/pricing/)
- [Fargateの料金](https://aws.amazon.com/jp/fargate/pricing/)、[データ転送の料金](https://aws.amazon.com/jp/ec2/pricing/on-demand/#Data_Transfer)
- [CloudWatchの料金](https://aws.amazon.com/jp/cloudwatch/pricing/)
- [ALBの料金](https://aws.amazon.com/jp/elasticloadbalancing/pricing/)、[NATGatewayの料金](https://aws.amazon.com/jp/vpc/pricing/)

### 試験環境のスケールの調整

シナリオファイルの規模が大きいと、試験環境のスペックが不足して正しく負荷をかけられない可能性があります。

負荷試験の試験環境をデプロイした際、CloudWatchのメトリクスにCPUとメモリの使用量推移を確認できます。

実際に負荷試験を実施して、メトリクスを参考に各シナリオ毎のCPU/メモリを増減させてください。

### aws cliを使ったアクセス

jmeterのコンテナには、aws cli/boto3(python3)がインストールされています。

jmeterの機能(OS Process Sampler)を利用してlinuxのコマンドを打ち、cli/SDKを使用した負荷試験対象へのアクセスを行うことができます。詳細は以下のリンクを参照してください。

- [JMeter_OS_Process_Sampler](https://jmeter.apache.org/usermanual/component_reference.html#OS_Process_Sampler)

:::

::::

<Footer/>