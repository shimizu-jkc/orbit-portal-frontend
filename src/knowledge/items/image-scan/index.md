# コンテナイメージを自動で脆弱性スキャンするCI/CD

<ScreenTransitionBtn btnName="戻る" path="/knowledge/search" />

## 目次

[[toc]]

___

## 脆弱性スキャンについて

セキュリティうんぬん

### 脆弱性スキャンをするメリット

- コンテナのセキュリティを向上できる
    - 外部から攻撃されても
- 複数の問題があるときに、どの脆弱性の対策から行うべきかわかる
    - それぞれの脆弱性に対して脅威レベルが定められている

### 脆弱性スキャン方法

- Dockerfileの検査
    - ベストプラクティスに沿わない書き方がされている箇所を抽出する。
    - 例：以下のようなベストプラクティスに沿って書かれているかどうかチェックする
    - [Dockerベストプラクティス(日本語版)](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html)、[Dockerベストプラクティス(英語版)](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- コンテナイメージのスキャン
    - ベストプラクティスに沿わない書き方がされている箇所を抽出する。
    - 脆弱性を含んでいる外部ライブラリやOSが含まれていた場合に抽出する。

## コンテナ脆弱性スキャンツール紹介

### [Hadolint](https://github.com/hadolint/hadolint)

Docker公式が出しているベストプラクティスを元に、Dockerfileを検査する。（元イメージは検査しない）

- スキャン対象：Dockerfile
- 検査基準：Hadolintオリジナルルール、[shellcheck](https://github.com/koalaman/shellcheck)

### [Dockle](https://github.com/goodwithtech/dockle)

コンテナイメージをスキャンし、DockerのベストプラクティスとDockle独自のルールに沿っているか検査する。元のイメージに含まれる脆弱性も検出する。

- スキャン対象：コンテナイメージ
- 検査基準：Dockerベストプラクティス、CISベンチマーク(Docker)、

### [Docker Bench for Security](https://github.com/docker/docker-bench-security)

Docker公式のベンチマークツール。CISのベンチマーク(Docker)をベースにDockerのベストプラクティスに沿っているか検査する。

- スキャン対象：コンテナイメージ
- 検査基準：CISベンチマーク(Docker)、Dockerオリジナルルール

### [Trivy](https://github.com/aquasecurity/trivy)

コンテナイメージからNVDから得た脆弱性を検出する。OSやライブラリで発生した脆弱性をリストアップする他、アプリケーションと依存関係にあるパッケージも含んで検出する。

- スキャン対象：コンテナイメージ
- 検査基準：NVD(脆弱性データベース)

### [Clair](https://github.com/quay/clair)

コンテナイメージからOSやライブラリで発生した脆弱性をリストアップする。curlやwgetなどのパッケージ管理ツール外で入れたパッケージは検査の対象にならない。

- スキャン対象：コンテナイメージ
- 検査基準：NVD(脆弱性データベース)

### 比較表

|              |             Hadolint             |                       Dockle                        |                      Docker Bench for Security                       |                                Trivy                                 |              Clair               |
| :----------: | -------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------- |
| スキャン対象 | Dockerfile                       | コンテナイメージ                                    | コンテナイメージ                                                     | コンテナイメージ                                                     | コンテナイメージ                 |
|   検査基準   | Hadolintオリジナル<br>shellcheck | Dockerベストプラクティス<br>CISベンチマーク(Docker) | NVD                                                                  | NVD                                                                  | NVD                              |
|   対象範囲   | Dockerfile記法                   | コンテナイメージ内                                  | OS、インストールしたパッケージ、アプリケーションが使用するパッケージ | OS、インストールしたパッケージ、アプリケーションが使用するパッケージ | OS、インストールしたパッケージ、 |

## コンテナをスキャンする

今回コンテナをスキャンするツールとして、`Hadolint`, `Dockle`, `Trivy`の3つを使います。

### GitHub Actionsで動かすワークフローの紹介

このフローは以下の仕様で動作します。

- devブランチに対してプルリクを作成したとき
- `container/`フォルダが更新されたとき
- 

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

あああ

## 用語集

|        用語        |                     正式名称                      |                           意味                           |
| -----------------: | ------------------------------------------------: | -------------------------------------------------------: |
| ベストプラクティス |                                                 - | そのツールを利用する際に推奨とされているプロセスや手法。 |
|                CVE |              Common Vulnerabilities and Exposures |             脆弱性に対して共通の識別子を付与したリスト。 |
|               NIST | National Institute of<br>Standards and Technology |                       アメリカ国立標準技術研究所のこと。 |
|                NVD |                   National Vulnerability Database |          NISTが提供する脆弱性のデータベース。CVEを含む。 |
