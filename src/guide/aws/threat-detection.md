# 脅威検知

パブリッククラウドはインターネット経由でのアクセスが可能であるが故、サイバー攻撃の標的にされる事が多く、その攻撃の手法は年々巧妙化し、発見し難くなっています。

これらのサイバー攻撃への対策を怠ると、「個人情報の漏洩」「IDの不正利用」「データの消失」といった甚大な損害を被る事となり、顧客からの信頼の失墜へと繋がります。

OrBITでは、サイバー攻撃に代表される様々な脅威を検知し、通知する仕組みを提供します。

ただし、この仕組みを利用しているから大丈夫、という訳ではありません。
セキュリティインシデントは早期の発見と迅速な対策が重要です。

プロジェクト側も不測の事態へ備え、セキュアな運用体制を構築する必要があります。

[[toc]]

## 利用するAWSサービス
AWSアカウント内の脅威の検知、および通知には、以下のサービスを利用しています。

- ***Amazon GuardDuty***

    悪意のある操作や不正な動作を継続的にモニタリングする脅威検出サービスです。
    環境内のネットワークとアカウントのアクティビティを継続的にモニタリングし、機械学習・異常検出・統合された脅威インテリジェンスを使用することで、潜在的な脅威を識別することができます。
    
    詳細は以下を参照してください。
    - [「Amazon GuardDutyユーザーガイド」](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.htmlcloudtrail-user-guide.html)
    - [「Amazon GuardDuty料金」](https://aws.amazon.com/jp/guardduty/pricing/)

- ***Amazon Simple Notification Service (Amzaon SNS)***

  サブスクライブしているクライアントへのメッセージの配信、管理を行うサービスです。
  Eメールをはじめとした、様々なプロトコルでサブスクライブすることが可能であり、検知した内容を本サービスを通じて通知することにより、監視を実現します。

    詳細は以下を参照してください。
    - [「Amazon SNSユーザーガイド」](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html)
    - [「Amazon SNS料金」](https://aws.amazon.com/jp/sns/pricing/)    

## アーキテクチャ
脅威検知、および通知をする仕組みに関しては、以下を参照してください。
- [ベースラインのアーキテクチャ](/guide/aws/baseline#アーキテクチャ)

## 検知元となるデータソース
*Amazon GuardDuty*は、下記のデータソースを分析して識別処理を行います。
- **CloudTrailイベントログ**
- **VPCフローログ**
- **Route53クエリログ**

このうち、**CloudTrailイベントログ**は、OrBITからAWSアカウントを払い出した時点で有効になっています。しかし、**VPCフローログ**と**Route53クエリログ**は、有効化されていません。

より精度の高い脅威検知を行う為、すべてのログを有効化することを推奨します。

::: tip NOTE
VPCやRoute53のリソースは、プロジェクトで必ず利用するサービスとは限らない為、これらのサービスに帰属したログの設定については、利用する側の責務となる事をご理解ください。
:::

## 検知する脅威の一覧
*Amazon GuardDuty*で検知する脅威に関しては、以下を参照してください。
- [「GuardDutyアクティブな結果タイプ」](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_finding-types-active.html)
::: tip INFO
*Amazon GuardDuty*で検知可能な脅威種別は、常に更新されます。
更新の際に通知を受け取る場合は、以下を参照してください。
- [「GuardDutyアナウンスメント」](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_sns.html)
:::

## 検知した脅威の通知
*Amazon GuardDuty*で検知した脅威については、OrBITが提供する[脅威検知スタック](/guide/aws/baseline#脅威検知スタック)における
SNSトピック: `orbit-AggregateGuardDutyNotification`を購読する事で通知を受け取る事ができます。

SNSトピックのサブスクライバについては、プロジェクト側で自由に設定が可能です。
ここでは、一例として**Eメール**、および**AWS Chatbotを利用したSlackへの転送**の文面を紹介します。

- Eメールへ送信した場合

``` js{0}
{
  "schemaVersion": "2.0",
  "accountId": "012345678910",
  "region": "ap-northeast-1",
  "partition": "aws",
  "id": "123456789abcdefghijklmnopqrstuvw",
  "arn": "arn:aws:guardduty:ap-northeast-1:123456789123:detector/123456789123/finding/123456789abcdefghijklmnopqrstuvw",
  "type": "Trojan:EC2/DropPoint",
  "resource": {
      "resourceType": "Instance",
      "instanceDetails": {
      "iamInstanceProfile": null,
      "imageId": null,
      "instanceId": "i-99999999",
      "instanceState": null,
      "instanceType": null,
      "launchTime": null,
      "networkInterfaces": null,
      "availabilityZone": null,
      "platform": null,
      "productCodes": null,
      "tags": null
      }
  },
  "service": {
      "serviceName": "guardduty",
      "detectorId": "abcdefghijklmnopqrstuvw123456789",
      "action": {
      "actionType": "NETWORK_CONNECTION",
      "networkConnectionAction": {
          "connectionDirection": "OUTBOUND",
          "remoteIpDetails": {
          "ipAddressV4": "xxx.xx.xx.xx",
          "organization": {
              "asn": -1,
              "asnOrg": "GeneratedFindingASNOrg",
              "isp": "GeneratedFindingISP",
              "org": "GeneratedFindingORG"
          },
          "country": {
              "countryName": "United States"
          },
          "city": {
              "cityName": "GeneratedFindingCityName"
          },
          "geoLocation": {
              "lat": 0,
              "lon": 0
          }
          },
          "remotePortDetails": {
          "port": 22,
          "portName": "SSH"
          },
          "localPortDetails": {
          "port": 2000,
          "portName": "Unknown"
          },
          "protocol": "TCP",
          "blocked": false
      }
      },
      "resourceRole": "TARGET",
      "additionalInfo": {
      "unusualProtocol": "UDP",
      "threatListName": "GeneratedFindingCustomerListName",
      "unusual": 22,
      "sample": true
      },
      "eventFirstSeen": "2017-11-29T20:39:48Z",
      "eventLastSeen": "2017-11-29T20:39:48Z",
      "archived": false,
      "count": 1
  },
  "severity": 5,
  "createdAt": "2017-11-29T20:39:48.441Z",
  "updatedAt": "2017-11-29T20:39:48.441Z",
  "title": "EC2 instance i-99999999 is communicating with a Drop Point.",
  "description": "EC2 instance i-99999999 is communicating with a remote host xxx.xx.xxx.x that is known to hold credentials and other stolen data captured by malware."
}
```

- *AWS Chatbot*を利用してSlackへ転送した場合

<CaptionedImage src="gd_chatbot_sample.png"/>

::: warning ATTENTION
AWSアカウント払い出しの際に「セキュリティ担当者」の役割が割り当てられた方は、事前にSNSトピックへの購読設定を行っていますが、それ以外の方は設定されていませんので、プロジェクトの体制に応じて適切に設定してください。
:::

## 脅威内容の確認
検知した脅威の詳細については、GuardDutyのコンソールから確認する事ができます。
詳細は以下を参照してください。
- [「GuardDuty 結果の検索と分析」](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings.html#guardduty_working-with-findings)

## 脅威への対策
検知した脅威への具体的な対策については、以下を参照してください。
- [「GuardDuty によって検出されたセキュリティ問題の修復」](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_remediate.html)

::: tip NOTE
具体的な対策案を立てられない際は、[問い合わせ窓口](/support/contact)よりお問い合わせください。
:::