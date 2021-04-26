# 管理者へ作業を依頼する

OrBITから払い出したAWSアカウントのルートユーザーは、プロジェクトに代わりOrBIT管理者が管理しています。
そのため、ルートユーザーでしか実施できない作業については、OrBIT管理者へ作業を依頼する必要があります。

ここでは、OrBIT管理者に対して作業を依頼する手順を紹介します。

[[toc]]

## 前提
- プロジェクトの登録とそれに紐づくAWSアカウントの払い出しが完了している必要があります。
- 作業の依頼主が当該AWSアカウントにおいて、1つ以上の役割が割り当てられている必要があります。
- ルートユーザーの扱いに関して、[こちら](/guide/aws/service/account-management.html#ルートユーザー)の内容を確認している必要があります。

## 関連サービス
- [AWSアカウント管理サービス](/guide/aws/service/account-management.html)
- [監査ログ記録・収集サービス](/guide/aws/service/audit.html)

## ルートユーザーでの作業を依頼する
ルートユーザーでしか実施できない作業を行う場合は、OrBIT管理者へ作業依頼をする必要があります。
対象となる作業の一覧は、[こちら](/guide/aws/service/account-management.html#ルートユーザーでしか実行できないタスク)をご覧ください。

依頼は[「作業の依頼」](/request/create-ticket.html)ページから行うことができます。
詳細な手順については、[こちら](/request/manual/create-ticket.html)をご覧ください。

## 監査ログの確認を依頼する
OrBITから払い出したAWSアカウントの監査ログは基本1年間、OrBIT管理者が保持しています。
ログの種別や管理ポリシーについては、[監査ログ記録・収集サービス](/guide/aws/service/audit.html)をご一読ください。

その監査ログの内容を確認したい場合、[「作業の依頼」](/request/create-ticket.html)ページから依頼することができます。
詳細な手順については、[こちら](/request/manual/create-ticket.html)をご覧ください。

## 作業状況を確認する
OrBIT管理者は作業依頼を受けた後、実際の作業に入ります。
作業の状況は、[「作業状況の確認」](/request/get-tickets.html)ページから確認することができます。
詳細な手順については、[こちら](/request/manual/get-update-ticket.html)をご覧ください。

作業の完了までは、最大で5営業日程度かかる場合があります。
作業が完了すると、OrBIT管理者から以下のようなメールが依頼主に届きますので、結果をご確認ください。
```
Subject:【ご連絡】XXXの完了
From：OrBIT管理者
Cc：当該クラウド環境の責任者、送信元以外のOrBIT管理者
```

結果が期待するものであれば、依頼した作業を完了にしてください。
完了にする手順は、[こちら](/request/manual/get-update-ticket.html)をご覧ください。