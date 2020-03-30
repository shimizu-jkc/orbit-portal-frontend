(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{312:function(t,a,n){"use strict";n.r(a);var e=n(9),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"脅威検知"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#脅威検知"}},[t._v("#")]),t._v(" 脅威検知")]),t._v(" "),n("p",[t._v("パブリッククラウドはインターネット経由でのアクセスが可能であるが故、サイバー攻撃の標的にされることが多く、その攻撃の手法は年々巧妙化し、発見し難くなっています。")]),t._v(" "),n("p",[t._v("これらのサイバー攻撃への対策を怠ると、「個人情報の漏洩」「IDの不正利用」「データの消失」といった甚大な損害を被ることとなり、顧客からの信頼の失墜へと繋がります。")]),t._v(" "),n("p",[t._v("OrBITでは、サイバー攻撃に代表される様々な脅威を検知し、通知する仕組みを提供します。")]),t._v(" "),n("p",[t._v("ただし、この仕組みを利用しているから大丈夫という訳ではありません。"),n("br"),t._v("\nセキュリティインシデントは早期の発見と迅速な対策が重要です。")]),t._v(" "),n("p",[t._v("プロジェクト側も不測の事態に備えた運用体制を構築する必要があります。")]),t._v(" "),n("p"),n("div",{staticClass:"table-of-contents"},[n("ul",[n("li",[n("a",{attrs:{href:"#利用するawsサービス"}},[t._v("利用するAWSサービス")])]),n("li",[n("a",{attrs:{href:"#アーキテクチャ"}},[t._v("アーキテクチャ")])]),n("li",[n("a",{attrs:{href:"#検知元となるデータソース"}},[t._v("検知元となるデータソース")])]),n("li",[n("a",{attrs:{href:"#検知する脅威の一覧"}},[t._v("検知する脅威の一覧")])]),n("li",[n("a",{attrs:{href:"#検知した脅威の通知"}},[t._v("検知した脅威の通知")]),n("ul",[n("li",[n("a",{attrs:{href:"#eメールへ送信した場合の文面"}},[t._v("Eメールへ送信した場合の文面")])]),n("li",[n("a",{attrs:{href:"#aws-chatbotを利用してslackへ転送した場合の文面"}},[t._v("AWS Chatbotを利用してSlackへ転送した場合の文面")])])])]),n("li",[n("a",{attrs:{href:"#脅威内容の確認"}},[t._v("脅威内容の確認")])]),n("li",[n("a",{attrs:{href:"#脅威への対策"}},[t._v("脅威への対策")])])])]),n("p"),t._v(" "),n("h2",{attrs:{id:"利用するawsサービス"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#利用するawsサービス"}},[t._v("#")]),t._v(" 利用するAWSサービス")]),t._v(" "),n("p",[t._v("AWSアカウント内の脅威の検知および通知には、以下のサービスを利用しています。")]),t._v(" "),n("ul",[n("li",[n("p",[n("em",[n("strong",[t._v("Amazon GuardDuty")])])]),t._v(" "),n("p",[t._v("悪意のある操作や不正な動作を継続的にモニタリングする脅威検出サービスです。"),n("br"),t._v("\n環境内のネットワークとアカウントのアクティビティを継続的にモニタリングし、機械学習・異常検出・統合された脅威インテリジェンスを使用することで、潜在的な脅威を識別することができます。")]),t._v(" "),n("p",[t._v("詳細は以下を参照してください。")]),t._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.htmlcloudtrail-user-guide.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Amazon GuardDutyユーザーガイド」"),n("OutboundLink")],1)]),t._v(" "),n("li",[n("a",{attrs:{href:"https://aws.amazon.com/jp/guardduty/pricing/",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Amazon GuardDuty料金」"),n("OutboundLink")],1)])])]),t._v(" "),n("li",[n("p",[n("em",[n("strong",[t._v("Amazon Simple Notification Service (Amzaon SNS)")])])]),t._v(" "),n("p",[t._v("サブスクライブしているクライアントへのメッセージの配信、管理を行うサービスです。"),n("br"),t._v("\nEメールをはじめとした、様々なプロトコルでサブスクライブすることが可能であり、検知した内容を本サービスを通じて通知することにより、監視を実現します。")]),t._v(" "),n("p",[t._v("詳細は以下を参照してください。")]),t._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Amazon SNSユーザーガイド」"),n("OutboundLink")],1)]),t._v(" "),n("li",[n("a",{attrs:{href:"https://aws.amazon.com/jp/sns/pricing/",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Amazon SNS料金」"),n("OutboundLink")],1)])])])]),t._v(" "),n("h2",{attrs:{id:"アーキテクチャ"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#アーキテクチャ"}},[t._v("#")]),t._v(" アーキテクチャ")]),t._v(" "),n("p",[t._v("脅威検知および通知をする仕組みは、"),n("a",{attrs:{href:"/guide/aws/baseline#%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3"}},[t._v("「ベースラインのアーキテクチャ」")]),t._v("を参照してください。")]),t._v(" "),n("h2",{attrs:{id:"検知元となるデータソース"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#検知元となるデータソース"}},[t._v("#")]),t._v(" 検知元となるデータソース")]),t._v(" "),n("p",[n("em",[t._v("Amazon GuardDuty")]),t._v("は、下記のデータソースを分析して識別処理を行います。")]),t._v(" "),n("ul",[n("li",[n("strong",[t._v("AWS CloudTrailイベントログ")])]),t._v(" "),n("li",[n("strong",[t._v("VPCフローログ")])]),t._v(" "),n("li",[n("strong",[t._v("Route53クエリログ")])])]),t._v(" "),n("p",[t._v("このうち、"),n("strong",[t._v("AWS CloudTrailイベントログ")]),t._v("は、プロジェクトアカウントを払い出した時点で有効になっています。しかし、"),n("strong",[t._v("VPCフローログ")]),t._v("と"),n("strong",[t._v("Route53クエリログ")]),t._v("は、有効化されていません。")]),t._v(" "),n("p",[t._v("より精度の高い脅威検知を行う為、すべてのログを有効化することを推奨します。")]),t._v(" "),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),n("p",[t._v("VPCやRoute53のリソースは、プロジェクトで必ず利用するサービスとは限らない為、これらのサービスに帰属したログの設定については、利用する側の責務となることをご理解ください。")])]),t._v(" "),n("h2",{attrs:{id:"検知する脅威の一覧"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#検知する脅威の一覧"}},[t._v("#")]),t._v(" 検知する脅威の一覧")]),t._v(" "),n("p",[n("em",[t._v("Amazon GuardDuty")]),t._v("で検知する脅威に関しては、"),n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_finding-types-active.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「GuardDutyアクティブな結果タイプ」"),n("OutboundLink")],1),t._v("を参照してください。")]),t._v(" "),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[t._v("INFO")]),t._v(" "),n("p",[n("em",[t._v("Amazon GuardDuty")]),t._v("で検知可能な脅威種別は、常に更新されます。"),n("br"),t._v("\n更新の際に通知を受け取る場合は、"),n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_sns.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「GuardDutyアナウンスメント」"),n("OutboundLink")],1),t._v("を参照してください。")])]),t._v(" "),n("h2",{attrs:{id:"検知した脅威の通知"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#検知した脅威の通知"}},[t._v("#")]),t._v(" 検知した脅威の通知")]),t._v(" "),n("p",[n("em",[t._v("Amazon GuardDuty")]),t._v("で検知した脅威については、OrBITベースラインにおける"),n("a",{attrs:{href:"/guide/aws/baseline#%E8%84%85%E5%A8%81%E6%A4%9C%E7%9F%A5%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF"}},[t._v("脅威検知スタック")]),t._v("のSNSトピック "),n("code",[t._v("orbit-AggregateGuardDutyNotification")]),t._v("を購読することで通知を受け取ることができます。")]),t._v(" "),n("p",[t._v("SNSトピックのサブスクライバについては、プロジェクト側で自由に設定が可能です。"),n("br"),t._v("\nここでは一例として、EメールとAWS Chatbotを利用してSlackへ転送した際の文面を紹介します。")]),t._v(" "),n("h3",{attrs:{id:"eメールへ送信した場合の文面"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#eメールへ送信した場合の文面"}},[t._v("#")]),t._v(" Eメールへ送信した場合の文面")]),t._v(" "),n("hr"),t._v(" "),n("CaptionedImage",{attrs:{src:"gd_mail_sample.png"}}),t._v(" "),n("CodeDetail",{attrs:{title:"成形したJSONを見る",code:'\n{\n  "schemaVersion": "2.0",\n  "accountId": "012345678910",\n  "region": "ap-northeast-1",\n  "partition": "aws",\n  "id": "123456789abcdefghijklmnopqrstuvw",\n  "arn": "arn:aws:guardduty:ap-northeast-1:123456789123:detector/123456789123/finding/123456789abcdefghijklmnopqrstuvw",\n  "type": "Trojan:EC2/DropPoint",\n  "resource": {\n      "resourceType": "Instance",\n      "instanceDetails": {\n      "iamInstanceProfile": null,\n      "imageId": null,\n      "instanceId": "i-99999999",\n      "instanceState": null,\n      "instanceType": null,\n      "launchTime": null,\n      "networkInterfaces": null,\n      "availabilityZone": null,\n      "platform": null,\n      "productCodes": null,\n      "tags": null\n      }\n  },\n  "service": {\n      "serviceName": "guardduty",\n      "detectorId": "abcdefghijklmnopqrstuvw123456789",\n      "action": {\n      "actionType": "NETWORK_CONNECTION",\n      "networkConnectionAction": {\n          "connectionDirection": "OUTBOUND",\n          "remoteIpDetails": {\n          "ipAddressV4": "xxx.xx.xx.xx",\n          "organization": {\n              "asn": -1,\n              "asnOrg": "GeneratedFindingASNOrg",\n              "isp": "GeneratedFindingISP",\n              "org": "GeneratedFindingORG"\n          },\n          "country": {\n              "countryName": "United States"\n          },\n          "city": {\n              "cityName": "GeneratedFindingCityName"\n          },\n          "geoLocation": {\n              "lat": 0,\n              "lon": 0\n          }\n          },\n          "remotePortDetails": {\n          "port": 22,\n          "portName": "SSH"\n          },\n          "localPortDetails": {\n          "port": 2000,\n          "portName": "Unknown"\n          },\n          "protocol": "TCP",\n          "blocked": false\n      }\n      },\n      "resourceRole": "TARGET",\n      "additionalInfo": {\n      "unusualProtocol": "UDP",\n      "threatListName": "GeneratedFindingCustomerListName",\n      "unusual": 22,\n      "sample": true\n      },\n      "eventFirstSeen": "2017-11-29T20:39:48Z",\n      "eventLastSeen": "2017-11-29T20:39:48Z",\n      "archived": false,\n      "count": 1\n  },\n  "severity": 5,\n  "createdAt": "2017-11-29T20:39:48.441Z",\n  "updatedAt": "2017-11-29T20:39:48.441Z",\n  "title": "EC2 instance i-99999999 is communicating with a Drop Point.",\n  "description": "EC2 instance i-99999999 is communicating with a remote host xxx.xx.xxx.x that is known to hold credentials and other stolen data captured by malware."\n}\n'}}),t._v(" "),n("h3",{attrs:{id:"aws-chatbotを利用してslackへ転送した場合の文面"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#aws-chatbotを利用してslackへ転送した場合の文面"}},[t._v("#")]),t._v(" AWS Chatbotを利用してSlackへ転送した場合の文面")]),t._v(" "),n("hr"),t._v(" "),n("CaptionedImage",{attrs:{src:"gd_chatbot_sample.png"}}),t._v(" "),n("div",{staticClass:"custom-block warning"},[n("p",{staticClass:"custom-block-title"},[t._v("ATTENTION")]),t._v(" "),n("p",[t._v("プロジェクトアカウント払い出しの際に「セキュリティ担当者」の役割が割り当てられた方は、事前にSNSトピックへの購読設定を行っていますが、それ以外の方は設定されていませんので、プロジェクトの体制に応じて適切に設定してください。")])]),t._v(" "),n("h2",{attrs:{id:"脅威内容の確認"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#脅威内容の確認"}},[t._v("#")]),t._v(" 脅威内容の確認")]),t._v(" "),n("p",[t._v("検知した脅威の詳細については、マネジメントコンソールから利用できる"),n("em",[t._v("Amazon GuardDuty")]),t._v("コンソールから確認することができます。詳細は"),n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings.html#guardduty_working-with-findings",target:"_blank",rel:"noopener noreferrer"}},[t._v("「GuardDuty 結果の検索と分析」"),n("OutboundLink")],1),t._v("を参照してください。")]),t._v(" "),n("h2",{attrs:{id:"脅威への対策"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#脅威への対策"}},[t._v("#")]),t._v(" 脅威への対策")]),t._v(" "),n("p",[t._v("検知した脅威への具体的な対策例については、 "),n("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_remediate.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「GuardDuty によって検出されたセキュリティ問題の修復」"),n("OutboundLink")],1),t._v("を参照してください。")]),t._v(" "),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),n("p",[t._v("具体的な対策案を立てられない際は、"),n("a",{attrs:{href:"/support/contact"}},[t._v("問い合わせ窓口")]),t._v("よりお問い合わせください。")])])],1)}),[],!1,null,null,null);a.default=r.exports}}]);