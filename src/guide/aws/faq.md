---
next: false
---

# よくある質問
ここでは、特に問い合わせの多い質問と回答を記載しています。

[[toc]]

## 全般

### Q. 導入実績はありますか？
現在、社内のいくつかのプロジェクトでご利用頂いています。

## AWSアカウント関連

### Q. ルートユーザーに登録されているメーリングリストは利用できますか？
はい。利用して頂いて構いません。

ただし、メーリングリストはOrBITコアで管理していますので、頻繁なユーザの登録や削除などが想定される、以下のようなケースでは利用を推奨しておりません。
- サービスの運用におけるアラート通知を受ける。
- 外注を含むプロジェクト内の連絡手段に使う。

## 運用関連
### Q. サービスの運用はしてもらえますか？
いいえ。サービス運用に関して直接的な支援は行っておりません。
ただし、運用代行サービスの紹介などは可能ですので、困っている場合はご相談ください。

## 料金関連

### Q. *AWS Config*の料金が少し高いのですが、抑える手段はありませんか？
OrBITではセキュリティポリシーに準拠するため、*AWS Config*の設定変更や記録の停止をすることを許可していません。

ですが、[「ベースラインの利用料金の参考」](/guide/aws/reference/baseline.html#利用料金の参考)でも示す通り、開発環境としての利用の場合、*AWS Config*の料金が嵩むようです。もし、どうしても抑える必要がある場合、以下のような対策が考えられます。

- 記録対象のリソースを制限します。詳細は下記を参照してください。
    -  [「AWS Config でサポートされている AWS リソースタイプとリソース関係」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/resource-config-reference.html)
    - [「AWS Config で記録するリソースの選択」](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/select-resources.html)

### Q. EC2インスタンスなどリソース毎に料金を確認する方法はありませんか？
OrBITでは以下のコスト配分タグを有効にしており、コスト把握に利用することができます。

| タグ名 | 想定用途 | 例 |
| :-- | :-- | :-- |
| `orbit:cost:Project` | プロジェクト単位での確認 | `orbit:cost:Project` = orbit |
| `orbit:cost:Group` | グループ単位での確認 | `orbit:cost:Group` = ServerGroup |
| `orbit:cost:Name` | リソース毎の確認 | `orbit:cost:Name` = Server1 |
| `orbit:cost:Env` | 環境毎の確認 | `orbit:cost:Env` = dev |

EC2などのタグを付与できるサービスにて、上記タグを付与することでタグ毎に使用しているコストを把握できるようになります。

コストの把握には ***AWS Cost Explorer*** を使用すると便利です。
使い方については[「こちら」](https://aws.amazon.com/jp/blogs/news/cost-allocation-tag/)を参考にしてください。

::: tip
OrBITの仕組み上、プロジェクトで利用しているAWSアカウント上ではコスト配分タグを有効にすることはできません。
上記以外のタグを希望する際は、[「こちら」](/support/contact.html)よりお問い合わせください。
:::