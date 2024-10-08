---
sidebar: auto
---

# おしらせ
OrBITのリリース情報やメンテナンス情報を掲載しています。

---

## コスト配分タグの提供を開始しました
<Badge text="リリース情報" type="tip" vertical="bottom"/>
<Badge text="AWS" type="note" vertical="bottom"/>

**投稿日 : 2021/11/1(月)**

本日、以下のコスト配分タグを有効にしました。

| タグ名 | 想定用途 | 例 |
| :-- | :-- | :-- |
| `orbit:cost:Project` | プロジェクト単位での確認 | `orbit:cost:Project` = orbit |
| `orbit:cost:Group` | グループ単位での確認 | `orbit:cost:Group` = ServerGroup |
| `orbit:cost:Name` | リソース毎の確認 | `orbit:cost:Name` = Server1 |
| `orbit:cost:Env` | 環境毎の確認 | `orbit:cost:Env` = dev |

EC2などのタグを付与できるサービスにて、上記タグを付与することでタグ毎に使用しているコストを把握できるようになります。

コストの把握には ***AWS Cost Explorer*** を使用すると便利です。
使い方については[「こちら」](https://aws.amazon.com/jp/blogs/news/cost-allocation-tag/)を参考にしてください。

## ユーザーガイドの更新やナレッジの追加を行いました
<Badge text="リリース情報" type="tip" vertical="bottom"/>

**投稿日 : 2021/7/8(木)**

本日、ユーザーガイドを以下の通り更新しました。
- [「AWSの利用開始手順とOrBITを利用した場合の手順比較」](/guide/aws/startup.html#一般的な利用開始手順との比較)を追加しました。
- OrBITの運用を担当する部署名を「技術開発部」から **「未来創造研究所」** へと変更しました。
- その他、軽微な修正を行いました。

また、以下のナレッジを新たに公開しましたので、是非ご覧ください。
- [「Jestを利用したテスト自動化環境の構築」](/knowledge/items/jest/index.html)

## β版の提供を開始しました
<Badge text="リリース情報" type="tip" vertical="bottom"/>
<Badge text="AWS" type="note" vertical="bottom"/>

**投稿日 : 2021/4/19(月)**

本日より、OrBITポータルのクローズドβ版の提供を開始しました。

β版では、OrBITの[ユーザーガイド](/guide/common/introduction.html)に加え、[クラウド環境の利用申請](/request/manual/create-account.html)や[情報の確認](/request/manual/get-update-account.html)を、本サイト上から行うことができます。
また、[ナレッジ](/knowledge/introduction.html)も公開していますので、是非ご覧ください。

尚、現在対応しているクラウドはAWS (Amazon Web Service) のみとなります。

<!--
## 合算した請求アラート機能の提供を開始しました
<Badge text="リリース情報" type="tip" vertical="bottom"/>
<Badge text="AWS" type="note" vertical="bottom"/>

**投稿日 : 2020/5/21(木)**

本日より、プロジェクトが所有する複数のアカウントを跨いだ請求アラートが利用可能になりました。

従来では、アカウント単位での請求アラートは任意で設定することが可能でしたが、アカウントを跨いだ請求アラートの設定はできませんでした。
本機能を使えば、複数アカウントの利用料金を合算した上で、プロジェクトの指定予算額に対するコスト超過の通知を受け取ることができるようになります。

詳細については、[こちら](/guide/aws/tutorial/project-budget-alert.html)を参照して下さい。
-->

<br><br>
<Footer/>
