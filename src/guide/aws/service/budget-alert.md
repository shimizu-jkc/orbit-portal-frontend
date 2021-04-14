---
next: false
---

# 利用料金アラート通知サービス
ここでは、複数のプロジェクトアカウントでの利用料金を合算し、プロジェクトの指定予算額を超えた、あるいは超えると予測された時にアラートを受け取るための手順について説明します。

[[toc]]

## 前提知識
このチュートリアルでは、AWSにおける請求アラートの設定に関する基本的な知識が必要となります。

一般的に、請求アラートを受け取るには、***AWS Budgets*** もしくは ***Amazon CloudWatch*** を利用する方法があります。各々の設定に関しては、以下を参照して下さい。
- [「AWS Budgetsを使用したコストの管理」](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html)
- [「Amazon CloudWatchを使用した請求額のモニタリング」](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)

## 前提条件
本機能の利用にあたって、以下の条件を満たしている必要があります。

- 合算対象とするすべてのAWSアカウントがOrBITから払い出されている。
- OrBIT利用時、もしくは利用開始後に予算額を指定している。

## 制限
合算した請求アラートの機能は、OrBITにより全プロジェクト共通で提供されるため、以下の設定を任意に変更することはできません。
- 予算の設定
- 請求アラートの数や設定
- 通知内容

::: warning ATTENTION
もし、どうしても変更したい場合は、[問い合わせ窓口](/support/contact.html)よりお問い合わせください。
:::

## 予算の設定値
***AWS Budgets*** における予算の設定値は以下になります。

| 項目名 | 設定値 | 備考 |
| :--- | :--- | :--- |
| 予算種別 | コスト予算 | | 
| 予算名 | orbit-ProjectBudgetFor${PROJECT} | **${PROJECT}** には申請時のプロジェクト名が入ります。 |
| 更新間隔 | 月別 | 毎月の請求期間の最初の日に更新されます。 |
| 予算額 | 任意 | 申請時の予算額が月毎に一定で設定されます。 |

また、各コストを予算に含むか否かの設定は、以下になります。

| コスト名 | 含まれるか否か |
| :--- | :---: |
| 返金 |  | 
| クレジット |  |
| 前払いの予約料金 | :heavy_check_mark: |
| 定期的な予約料金 | :heavy_check_mark: |
| そのほかのサブスクリプションコスト | :heavy_check_mark: |
| 税金 | |
| サポートの料金 | :heavy_check_mark: |
| 割引 | :heavy_check_mark: |

## 請求アラートの設定値
***AWS Budgets*** におけるアラートの設定値は以下になります。

| アラート種別 | 閾値 | 通知先 |
| :--- | :--- | :--- |
| 実測値 | 予算の**50%** | 請求管理者*1, [プロジェクト用請求アラート通知トピック](#請求アラート通知トピック) |
| 実測値 | 予算の**80%** | 請求管理者*1, [プロジェクト用請求アラート通知トピック](#請求アラート通知トピック) |
| 実測値 | 予算の**100%** | 請求管理者*1, [プロジェクト用請求アラート通知トピック](#請求アラート通知トピック) |
| 予測値 | 予算の**100%** | 請求管理者*1, [プロジェクト用請求アラート通知トピック](#請求アラート通知トピック) |

*1 登録時にサブスクリプションの確認を行っている必要があります。

## 請求アラート通知トピック
合算した請求アラートは、以下のSNSトピックへ発行されます。
```
arn:aws:sns:us-east-1:904580840362:orbit-ProjectBudgetAlertFor${PROJECT}
```
::: tip NOTE
- トピックを購読する際には、**${PROJECT}** をプロジェクト名に置き換えてください。
- 現在、`us-east-1(バージニア北部)`リージョンのみの提供となります。
:::

### トピックに発行されるJSONの形式
---
請求アラートがトリガーされると、JSON形式のメッセージをトピックから受け取ることができます。
``` js{9}
{
    "subscribeUrl": null,
    "type": "Notification",
    "signatureVersion": "1",
    "signature": "r2nPV5BduApBRV03c1Cfz5Nj2lbPVGvUEMcV7ZiQZm5YED8mvgbF4hPMG/WVgXPvXQ0Gu==",
    "topicArn": "arn:aws:sns:us-east-1:904580840362:orbit-ProjectBudgetAlertTopicFor${PROJECT}",
    "signingCertUrl": "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-xxx.pem",
    "messageId": "51867a35-1089-5189-a4af-2d02fa36106-0123456789",
    "message": "AWS Budget Notification May 15, 2020\nAWS Account 012345678910\n\nDear AWS Customer,\n\nYou requested that we alert you when the Actual Cost associated with your tearaes budget is greater than $1.00 for the current month. The Actual Cost associated with this budget is $1.01. You can find additional details below and by accessing the AWS Budgets dashboard [1].\n\nBudget Name: tearaes\nBudget Type: Cost\nBudgeted Amount: $1.00\nAlert Type: Actual\nAlert Threshold: > $1.00\nActual Amount: $5.24\n\n[1] https://console.aws.amazon.com/billing/home#/budgets\n",
    "subject": "AWS Budgets: orbit-ProjectBudgetFor${PROJECT} has exceeded your alert threshold",
    "unsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:904580840362:orbit-ProjectBudgetAlertTopicFor${PROJECT}:***REDACTED***",
    "timestamp": "2020-01-01T00:00:00.000Z",
    "token": null
}
```

::: tip INFO
`message`属性の内容がJSON形式でないのは、*AWS Budgets*の仕様です。
:::

## マネジメントコンソールで合算した請求アラートのEメール通知を設定する

1. マネジメントコンソールにサインインし、[「Amazon SNSコンソール」](https://console.aws.amazon.com/sns/v3/home)を開きます。

2. リージョンのリストで、`us-east-1(バージニア北部)`リージョンを選択します。

3. 左のナビゲーションペインで、**[サブスクリプション]** を選択します。

4. 画面右上の **[サブスクリプションの作成]** を選択します。

5. **[サブスクリプションの作成]** ダイアログボックスの **[トピックARN]** に、プロジェクト毎の[請求アラート通知トピック](#請求アラート通知トピック)のARNを貼り付けます。

6. **[プロトコル]** で **[Eメール]** を選択します。また、**[エンドポイント]** では、通知を受信するEメールアドレスを入力します。

7. **[サブスクリプションの作成]** を選択します。

8. EメールアプリケーションでAWSから届いたメッセージを開き、リンクを開きます。

ウェブブラウザに Amazon SNSの確認画面が表示され、**[確認済み]** になっていれば設定は完了です。

## AWS CLIを使用して合算した請求アラートのEメール通知を設定する

1. AWS CLIを使用して次のコマンドを実行します。

```
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:904580840362:orbit-ProjectBudgetAlertFor${PROJECT} --protocol email --notification-endpoint your_email@jvckenwood.com --region us-east-1
```

2. EメールアプリケーションでAWSから届いたメッセージを開き、リンクを開きます。

ウェブブラウザに Amazon SNSの確認画面が表示され、**[確認済み]** になっていれば設定は完了です。

