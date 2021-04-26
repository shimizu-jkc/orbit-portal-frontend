# コンテナイメージを自動で脆弱性スキャンするCI/CD

<ScreenTransitionBtn btnName="戻る" />

IPAの[脆弱性対応ガイドライン](https://www.ipa.go.jp/security/ciadr/partnership_guide.html)より、サイバーセキュリティの現状が述べられています。

> 2000 年頃より、日本国内においてソフトウエアやウェブアプリケーションの脆弱性が発見されることが増えており、これらの脆弱性を悪用した不正アクセス行為やコンピュータウイルスの増加により、企業活動が停止したり情報資産が滅失したり個人情報が漏えいしたりといった、重大な被害が生じています。

上記のような被害を未然に防ぐため、ソフトウェアやアプリケーションの脆弱性を検出できる環境が必要になります。本ナレッジでは、コンテナを扱うケースを例に、脆弱性を検出するツールや、継続的に検出可能な CI/CD 環境について紹介します。

___

[[toc]]

___

## 用語集

|        用語        |               正式名称               |                                 意味                                 |
| -----------------: | -----------------------------------: | -------------------------------------------------------------------: |
| ベストプラクティス |                                    - |         そのツールを利用する際に推奨とされているプロセスや手法のこと |
|                CVE | Common Vulnerabilities and Exposures |                     脆弱性に対して共通の識別子を付与したリストのこと |
|                NVD |      National Vulnerability Database | NIST(アメリカ国立標準技術研究所)が提供する脆弱性のデータベースのこと |

## 脆弱性スキャンをするメリット

- コンテナのセキュリティを向上できる
    - 外部から攻撃/侵入される余地が少なくなります。
    - 侵入されても、被害を最小限に留めることができます。
- 脆弱性の脅威レベルや原因が把握できる
    - それぞれの脆弱性に対して脅威レベルが定められているため、脆弱性の対策の順番を定めやすくなります。
    - 脆弱性の原因が具体的に指摘されるため、修正が容易です。

## 脆弱性スキャンの基準

- [Dockerベストプラクティス](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html)
    - コンテナを定義する際に、適切な書き方を提示しています。
    - ベストプラクティスに沿わない場合、コンテナに脆弱性が含まれる可能性があります。
- [共通脆弱性識別子CVE](https://www.ipa.go.jp/security/vuln/CVE.html)
    - 外部のライブラリやOSが脆弱性を含んでいる場合、CVEが割り当てられます。
    - 該当するライブラリやOSを使用している場合、そのコンテナは脆弱性が含まれています。
    - CVEは脆弱性データベース(NVDなど)から取得でき、該当するバージョンや脆弱性の詳細な情報が得られます。

## コンテナ脆弱性スキャンツール紹介

### [Hadolint](https://github.com/hadolint/hadolint)

Docker公式が出しているベストプラクティスを元に、Dockerfileを検査します（引用元のイメージは検査しない）。 Dockerfile内に記載されているshellスクリプトは`shellcheck`を使用してスキャンします。

- スキャン対象：Dockerfile
- 検査基準：Dockerベストプラクティス、[shellcheck](https://github.com/koalaman/shellcheck)

#### 使用方法

```shell
$ brew install hadolint
$ hadolint /path/to/dir/Dockerfile
```

**検出ログのサンプル**

```
container/jmeter/Dockerfile:15 DL3047 warning: Avoid use of wget without progress bar. Use `wget --progress=dot:giga <url>`.Or consider using `-q` or `-nv` (shorthands for `--quiet` or `--no-verbose`).
container/jmeter/Dockerfile:15 DL3017 error: Do not use apk upgrade
container/jmeter/Dockerfile:15 DL4001 warning: Either use Wget or Curl but not both
container/jmeter/Dockerfile:15 DL3019 info: Use the `--no-cache` switch to avoid the need to use `--update` and remove `/var/cache/apk/*` when done installing packages
container/jmeter/Dockerfile:15 DL3018 warning: Pin versions in apk add. Instead of `apk add <package>` use `apk add <package>=<version>`
```

### [Dockle](https://github.com/goodwithtech/dockle)

DockerのベストプラクティスとCISベンチマークに加え、Dockle独自のルールに沿っているコンテナイメージであるか検査します。元のイメージに含まれる脆弱性も検出します。外部のライブラリやOSは検出対象にはなりません。

- スキャン対象：コンテナイメージ
- 検査基準：Dockerベストプラクティス、CISベンチマーク(Docker)

#### 使用方法

```shell
$ brew install dockle
$ dockle target_image_name:tag_name
```

**検出ログのサンプル**

```
FATAL	- DKL-DI-0003: Avoid apt-get/apk/dist-upgrade
	* Avoid upgrade in container : |2 JMETER_VERSION=5.2.1 TZ=Asia/Tokyo /bin/sh -c apk update 	&& apk upgrade 	&& apk add ca-certificates 	&& update-ca-certificates 	&& apk add --update openjdk8-jre tzdata curl unzip bash 	&& apk add --no-cache nss 	&& rm -rf /var/cache/apk/* 	&& mkdir -p /tmp/dependencies  	&& curl -L --silent ${JMETER_DOWNLOAD_URL} >  /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz  	&& mkdir -p /opt  	&& tar -xzf /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz -C /opt  	&& rm -rf /tmp/dependencies     && wget -O ${JMETER_HOME}/lib/ext/mqtt-xmeter-1.13.jar "emqx/mqtt-jmeter@master/Download/v1.13.0/mqtt-xmeter-1.13-jar-with-dependencies.jar?raw=true"
WARN	- CIS-DI-0001: Create a user for the container
	* Last user should not be root
INFO	- CIS-DI-0006: Add HEALTHCHECK instruction to the container image
	* not found HEALTHCHECK statement
```

### [Docker Bench for Security](https://github.com/docker/docker-bench-security)

Docker公式のベンチマークツール。CISのベンチマーク(Docker)をベースにDockerのベストプラクティスに沿っているコンテナイメージか検査します。複数のイメージを同時にスキャン可能です。

- スキャン対象：コンテナイメージ
- 検査基準：Dockerベストプラクティス、CISベンチマーク(Docker)

#### 使用方法

```shell
$ docker run --rm --net host --pid host --userns host --cap-add audit_control \
    -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
    -v /etc:/etc:ro \
    -v /usr/bin/containerd:/usr/bin/containerd:ro \
    -v /usr/bin/runc:/usr/bin/runc:ro \
    -v /usr/lib/systemd:/usr/lib/systemd:ro \
    -v /var/lib:/var/lib:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    --label docker_bench_security \
    -t target_image_name:tag_name \
    docker/docker-bench-security
```

**検出ログのサンプル**

```
[INFO] 4 - Container Images and Build File
[INFO] 4.1  - Ensure a user for the container has been created
[INFO]      * No containers running
[NOTE] 4.2  - Ensure that containers use trusted base images
[NOTE] 4.3  - Ensure unnecessary packages are not installed in the container
[NOTE] 4.4  - Ensure images are scanned and rebuilt to include security patches
[WARN] 4.5  - Ensure Content trust for Docker is Enabled
[WARN] 4.6  - Ensure HEALTHCHECK instructions have been added to the container image
.
.
.
```

### [Trivy](https://github.com/aquasecurity/trivy)

NVDから得た脆弱性を元に、コンテナイメージに脆弱性が含まれているライブラリやOSが使用されているか検出します。アプリケーションと依存関係にあるパッケージも含めて検出することができます。

- スキャン対象：コンテナイメージ
- 検査基準：NVD(脆弱性データベース)

#### 使用方法

```shell
$ brew install trivy
$ trivy image target_image_name:tag_name
```

**検出ログのサンプル**

```
jmeter_jmeter:latest (alpine 3.11.5)
====================================
Total: 19 (UNKNOWN: 1, LOW: 2, MEDIUM: 8, HIGH: 8, CRITICAL: 0)

+--------------+------------------+----------+-------------------+---------------+---------------------------------------+
|   LIBRARY    | VULNERABILITY ID | SEVERITY | INSTALLED VERSION | FIXED VERSION |                 TITLE                 |
+--------------+------------------+----------+-------------------+---------------+---------------------------------------+
| apk-tools    | CVE-2021-30139   | UNKNOWN  | 2.10.4-r3         | 2.10.6-r0     | -->avd.aquasec.com/nvd/cve-2021-30139 |
+--------------+------------------+----------+-------------------+---------------+---------------------------------------+
| busybox      | CVE-2021-28831   | HIGH     | 1.31.1-r9         | 1.31.1-r10    | busybox: invalid free or segmentation |
|              |                  |          |                   |               | fault via malformed gzip data         |
|              |                  |          |                   |               | -->avd.aquasec.com/nvd/cve-2021-28831 |
+--------------+------------------+          +-------------------+---------------+---------------------------------------+
| libcrypto1.1 | CVE-2020-1967    |          | 1.1.1d-r3         | 1.1.1g-r0     | openssl: Segmentation                 |
|              |                  |          |                   |               | fault in SSL_check_chain              |
|              |                  |          |                   |               | causes denial of service              |
|              |                  |          |                   |               | -->avd.aquasec.com/nvd/cve-2020-1967  |
+              +------------------+          +                   +---------------+---------------------------------------+
|              | CVE-2021-23840   |          |                   | 1.1.1j-r0     | openssl: integer                      |
|              |                  |          |                   |               | overflow in CipherUpdate              |
|              |                  |          |                   |               | -->avd.aquasec.com/nvd/cve-2021-23840 |
+              +------------------+----------+                   +---------------+---------------------------------------+
|              | CVE-2020-1971    | MEDIUM   |                   | 1.1.1i-r0     | openssl: EDIPARTYNAME                 |
|              |                  |          |                   |               | NULL pointer de-reference             |
|              |                  |          |                   |               | -->avd.aquasec.com/nvd/cve-2020-1971  |
.              .                  .          .                   .               .                                       .
.              .                  .          .                   .               .                                       .
.              .                  .          .                   .               .                                       .

```

### [Clair](https://github.com/quay/clair)

NVDから得た脆弱性を元に、コンテナイメージに脆弱性が含まれているライブラリやOSが使用されているか検出します。パッケージ管理ツールを使わずにインストール(curlやwgetなど)した場合、そのパッケージは検査の対象になりません。 AWSのECRのリポジトリの公式スキャンツールに採用されており、ワンクリックでスキャンを実行できます。

- スキャン対象：コンテナイメージ
- 検査基準：NVD(脆弱性データベース)

#### 使用方法

```shell
$ ～調整中～
```

**検出ログのサンプル**

```
[ERRO] ▶ Image [httpd:2.4.37] contains 146 unapproved vulnerabilities
+------------+-----------------------------+--------------+------------------------+--------------------------------------------------------------+
| STATUS     | CVE SEVERITY                | PACKAGE NAME | PACKAGE VERSION        | CVE DESCRIPTION                                              |
+------------+-----------------------------+--------------+------------------------+--------------------------------------------------------------+
| Unapproved | High CVE-2018-14614         | linux        | 4.9.130-2              | An issue was discovered in the Linux kernel                  |
|            |                             |              |                        | through 4.17.10. There is an out-of-bounds                   |
|            |                             |              |                        | access in __remove_dirty_segment() in                        |
|            |                             |              |                        | fs/f2fs/segment.c when mounting an f2fs image.               |
|            |                             |              |                        | https://security-tracker.debian.org/tracker/CVE-2018-14614   |
+------------+-----------------------------+--------------+------------------------+--------------------------------------------------------------+
| Unapproved | High CVE-2018-14610         | linux        | 4.9.130-2              | An issue was discovered in the Linux kernel                  |
|            |                             |              |                        | through 4.17.10. There is out-of-bounds access               |
|            |                             |              |                        | in write_extent_buffer() when mounting and                   |
|            |                             |              |                        | operating a crafted btrfs image, because of a                |
|            |                             |              |                        | lack of verification that each block group has               |
|            |                             |              |                        | a corresponding chunk at mount time, within                  |
|            |                             |              |                        | btrfs_read_block_groups in fs/btrfs/extent-tree.c.           |
|            |                             |              |                        | https://security-tracker.debian.org/tracker/CVE-2018-14610   |
.            .                             .              .                        .                                                              .
.            .                             .              .                        .                                                              .
.            .                             .              .                        .                                                              .
```

### 比較表

|              |                Hadolint                |                                 Dockle                                  |              Docker Bench for Security              |                                  Trivy                                   |              Clair               |
| :----------: | -------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| スキャン対象 | Dockerfile                             | コンテナイメージ                                                        | コンテナイメージ                                    | コンテナイメージ                                                         | コンテナイメージ                 |
|   検査基準   | Dockerベストプラクティス<br>shellcheck | Dockerベストプラクティス<br>CISベンチマーク(Docker)<br>Dockle独自ルール | Dockerベストプラクティス<br>CISベンチマーク(Docker) | NVD                                                                      | NVD                              |
|   対象範囲   | Dockerfile記法                         | コンテナイメージ                                                        | コンテナイメージ                                    | OS<br>インストールしたパッケージ<br>アプリケーションが使用するパッケージ | OS<br>インストールしたパッケージ |

## コンテナをスキャンする

今回コンテナをスキャンするツールとして、`Hadolint`, `Dockle`, `Trivy`の3つを使います。

### GitHub Actionsで動かすワークフローの紹介

このフローは以下の仕様で記述しました。

- プルリクエストを作成したとき動作する
    - 以下のフォルダが更新されたとき動作する
    - `container/`フォルダ
    - `.github/workflows`フォルダ
- `Hadolint`, `Dockle`, `Trivy`を動かす
    - 3つのツールを並列で動作させる
    - 脆弱性が検出されてもフローは継続する
- 結果を出力する
    - 脆弱性が検出されたときにNG判定になる
    - 結果をログで出力する
    - 結果ファイルをGitHubActionsのアーティファクトに保存する

#### ソースコード全体

::: details GitHub Actionsワークフローのソースコード(全体)

```yaml
name: Check docker image 

on:
  pull_request:
    branches:
      - dev
    paths:
      - 'container/**'
      - '.github/workflows/**'

jobs:
  deploy:
    name: scan and lint
    runs-on: ubuntu-latest
    env:
      DEPLOY_ENV: "dev"
      AWS_REGION: "us-west-2"
      IMAGE_TAG: "test"
      RESULT_DIR: "result"
      TARGET_CONTAINER: "container/jmeter"
      CONTAINER_NAME: "jmeter"
      SSH_KEY_FOR_ORBIT_LIB_COMMON: ${{ secrets.SSH_KEY_FOR_ORBIT_LIB_COMMON }}
      SLACK_WEBHOOK_URL: ${{ secrets.ORBIT_CICD_TEST_SLACK_WEBHOOK }}
      SLACK_ICON_URL: "https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png"
    steps:
      - uses: actions/checkout@v2
      - name: Checkout submodules
        run: |
          mkdir -p /home/runner/.ssh/
          echo -e "${SSH_KEY_FOR_ORBIT_LIB_COMMON}" > /home/runner/.ssh/id_rsa
          chmod 600 /home/runner/.ssh/id_rsa
          git submodule sync --recursive
          git submodule update --init --force --recursive --remote
      - name: Build container
        env:
          IMAGE_REF: ${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        run: |
          docker build -t $IMAGE_REF $TARGET_CONTAINER
      - name: Set up Homebrew
        id: set-up-homebrew
        uses: Homebrew/actions/setup-homebrew@master
      - name: Setup hadolint, dockle, trivy
        run: |
          mkdir $RESULT_DIR
          brew instal hadolint goodwithtech/r/dockle aquasecurity/trivy/trivy
      - name: Exec hadolint, dockle, trivy
        env:
          IMAGE_REF: ${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        run: |
          hadolint $TARGET_CONTAINER/Dockerfile --no-fail > $RESULT_DIR/hadolint.log &
          dockle --exit-code 0 $IMAGE_REF > $RESULT_DIR/dockle.log &
          trivy image --exit-code 0 $IMAGE_REF > $RESULT_DIR/trivy.log &
          wait
      - name: Upload to artifact
        uses: actions/upload-artifact@v2
        with:
          name: logs
          path: ${{ env.RESULT_DIR }}/*.log
      - name: Check fatal-error
        id: fatal-checker
        run: |
          cat $RESULT_DIR/hadolint.log
          cat $RESULT_DIR/dockle.log
          cat $RESULT_DIR/trivy.log

          hado_err=$(grep -c error $RESULT_DIR/hadolint.log)
          hado_warn=$(grep -c warning $RESULT_DIR/hadolint.log)
          dockle_err=$(grep -c FATAL $RESULT_DIR/dockle.log)
          dockle_warn=$(grep -c WARN $RESULT_DIR/dockle.log)

          trivy_fatal=$(grep -o -e "CRITICAL: [0-9]*" $RESULT_DIR/trivy.log | awk '{print $ 2;}')
          trivy_err=$(grep -o -e "HIGH: [0-9]*" $RESULT_DIR/trivy.log | awk '{print $ 2;}')
          trivy_warn=$(grep -o -e "MEDIUM: [0-9]*" $RESULT_DIR/trivy.log | awk '{print $ 2;}')
          
          if [ $hado_err -eq 0 ] && [ $hado_warn -eq 0 ]\
            && [ $dockle_err -eq 0 ] && [ $dockle_warn -eq 0 ]\
            && [ $trivy_fatal -eq 0 ] && [ $trivy_err -eq 0 ] && [ $trivy_warn -eq 0 ]\
            ; then
              exit 0
          else
              exit 1
          fi
      - name: Notify success to slack
        if: success()
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_USERNAME: ${{ github.repository }}
          SLACK_WEBHOOK: ${{ env.SLACK_WEBHOOK_URL }}
          SLACK_ICON: ${{ env.SLACK_ICON_URL }}
          SLACK_TITLE: "success"
          SLACK_MESSAGE: "container scan was finished"
      - name: Notify failure to slack
        if: failure()
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_USERNAME: ${{ github.repository }}
          SLACK_WEBHOOK: ${{ env.SLACK_WEBHOOK_URL }}
          SLACK_ICON: ${{ env.SLACK_ICON_URL }}
          SLACK_TITLE: "failed to scan docker image"
          SLACK_COLOR: "#FF0000"
```

:::

#### ソースコードの解説

##### GitHub Actionsのトリガー設定

- `on`で、いつワークフローを起動するか設定する
- `pull_request`でプルリク作成時(および更新時)に起動できる。

::: details Gitトリガー設定

```yaml{4}
name: Check docker image 

on:
  pull_request:        # プルリクエスト作成時に起動
    branches:
      - dev
    paths:
      - 'container/**'
      - '.github/workflows/**'
```

:::

##### 実行環境と環境変数を指定する

- `runs-on`で実行環境を設定する
- `env`で環境変数を設定する
    - `secrets.XXXXXXX`で、GitHubに設定したシークレットの変数（例えばアクセスキーなど）を利用できます。
        - アクセスキーをソースコード上に公開せずに実行が可能になります。

::: details 実行環境と環境変数の設定

```yaml{4-5}
jobs:
  deploy:
    name: scan and lint
    runs-on: ubuntu-latest        # ubuntuの最新版で実行
    env:                          # 環境変数の設定
      DEPLOY_ENV: "dev"
      AWS_REGION: "us-west-2"
      IMAGE_TAG: "test"
      RESULT_DIR: "result"
      TARGET_CONTAINER: "container/jmeter"
      CONTAINER_NAME: "jmeter"
      SSH_KEY_FOR_ORBIT_LIB_COMMON: ${{ secrets.SSH_KEY_FOR_ORBIT_LIB_COMMON }}
      SLACK_WEBHOOK_URL: ${{ secrets.ORBIT_CICD_TEST_SLACK_WEBHOOK }}
      SLACK_ICON_URL: "https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png"
```

:::

##### ソースコードの取得とコンテナのビルド

- `uses: actions/checkout@v2`でソースコードの取得([GitHub公式の提供](https://github.com/actions))
- Checkout submodulesは、上記のソースコードの取得で取得できないsubmodulesのソースを取得している
- Build containerは、スキャンする対象となるコンテナイメージをビルドする

::: details GitHubからソースコードを取得＆コンテナのビルド

```yaml{2,3,10}
    steps:
      - uses: actions/checkout@v2        # ソースコードの取得
      - name: Checkout submodules        # submoduleのソースコード取得
        run: |
          mkdir -p /home/runner/.ssh/
          echo -e "${SSH_KEY_FOR_ORBIT_LIB_COMMON}" > /home/runner/.ssh/id_rsa
          chmod 600 /home/runner/.ssh/id_rsa
          git submodule sync --recursive
          git submodule update --init --force --recursive --remote
      - name: Build container            # コンテナのビルド
        env:
          IMAGE_REF: ${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        run: |
          docker build -t $IMAGE_REF $TARGET_CONTAINER
```

:::

##### 3つのスキャンツールの実行

- `Hadolint`, `Dockle`, `Trivy`をそれぞれ実行し、ログファイルに出力する

::: details スキャンの実行

```yaml{5-8}
      - name: Exec hadolint, dockle, trivy
        env:
          IMAGE_REF: ${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        run: |
          hadolint $TARGET_CONTAINER/Dockerfile --no-fail > $RESULT_DIR/hadolint.log &
          dockle --exit-code 0 $IMAGE_REF > $RESULT_DIR/dockle.log &
          trivy image --exit-code 0 $IMAGE_REF > $RESULT_DIR/trivy.log &
          wait
      - name: Upload to artifact
        uses: actions/upload-artifact@v2
        with:
          name: logs
          path: ${{ env.RESULT_DIR }}/*.log
```

:::
