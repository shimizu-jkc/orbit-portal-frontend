(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{209:function(t,a,r){"use strict";r.r(a);var _=r(0),v=Object(_.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"awsアカウントの管理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#awsアカウントの管理"}},[t._v("#")]),t._v(" AWSアカウントの管理")]),t._v(" "),r("p",[t._v("AWSを利用するには、まずはAWSアカウントを作成する必要があります。")]),t._v(" "),r("p",[t._v("AWSアカウントは、一般的には以下の手順で開設しますが、"),r("br"),t._v("\n払い出したアカウントは基盤チームでやるよ。")]),t._v(" "),r("p"),r("div",{staticClass:"table-of-contents"},[r("ul",[r("li",[r("a",{attrs:{href:"#awsアカウントの払い出しについて"}},[t._v("AWSアカウントの払い出しについて")]),r("ul",[r("li",[r("a",{attrs:{href:"#払い出しのフロー"}},[t._v("払い出しのフロー")])]),r("li",[r("a",{attrs:{href:"#各種ロールについての説明"}},[t._v("各種ロールについての説明")])]),r("li",[r("a",{attrs:{href:"#メーリングリストについて"}},[t._v("メーリングリストについて")])])])]),r("li",[r("a",{attrs:{href:"#ルートユーザーについて"}},[t._v("ルートユーザーについて")]),r("ul",[r("li",[r("a",{attrs:{href:"#ルートユーザーの管理"}},[t._v("ルートユーザーの管理")])]),r("li",[r("a",{attrs:{href:"#ルートユーザーでしか実行できないタスク"}},[t._v("ルートユーザーでしか実行できないタスク")])]),r("li",[r("a",{attrs:{href:"#ルートユーザーでの作業依頼"}},[t._v("ルートユーザーでの作業依頼")])])])])])]),r("p"),t._v(" "),r("h2",{attrs:{id:"awsアカウントの払い出しについて"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#awsアカウントの払い出しについて"}},[t._v("#")]),t._v(" AWSアカウントの払い出しについて")]),t._v(" "),r("p",[t._v("OrBITでは、")]),t._v(" "),r("ul",[r("li"),t._v(" "),r("li",[r("p",[t._v("依頼")])]),t._v(" "),r("li",[r("p",[t._v("審査")])]),t._v(" "),r("li",[r("p",[t._v("メーリングリスト作成")])]),t._v(" "),r("li",[r("p",[t._v("環境構築")])]),t._v(" "),r("li",[r("p",[t._v("完了")])])]),t._v(" "),r("h3",{attrs:{id:"払い出しのフロー"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#払い出しのフロー"}},[t._v("#")]),t._v(" 払い出しのフロー")]),t._v(" "),r("p",[r("a",{attrs:{href:"/request/create-env"}},[t._v("ここ")]),t._v("からやるよ。")]),t._v(" "),r("h3",{attrs:{id:"各種ロールについての説明"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#各種ロールについての説明"}},[t._v("#")]),t._v(" 各種ロールについての説明")]),t._v(" "),r("h3",{attrs:{id:"メーリングリストについて"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#メーリングリストについて"}},[t._v("#")]),t._v(" メーリングリストについて")]),t._v(" "),r("p",[t._v("プロジェクト名と用途に合わせてこちらが作るよ。"),r("br"),t._v("\nこのメーリングリストは以下の条件以外で使っていいよ。")]),t._v(" "),r("h2",{attrs:{id:"ルートユーザーについて"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ルートユーザーについて"}},[t._v("#")]),t._v(" ルートユーザーについて")]),t._v(" "),r("p",[t._v("AWSアカウントを作成する際、必ず最初にルートユーザーというユーザーで作業を行う必要があります。ルートユーザーは、すべてのAWSサービスとリソースに対して完全なアクセス権限を持つため、日常的なタスクには使用しないことが推奨されています。")]),t._v(" "),r("p",[t._v("一般的に、このようなアクセス権限管理(IAM)は、以下の事項に従う事が推奨されます。")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html#create-iam-users",target:"_blank",rel:"noopener noreferrer"}},[t._v("「IAMのベストプラクティス」"),r("OutboundLink")],1)])]),t._v(" "),r("p",[t._v("ここでは、OrBITにおけるルートユーザーの管理について説明します。")]),t._v(" "),r("h3",{attrs:{id:"ルートユーザーの管理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ルートユーザーの管理"}},[t._v("#")]),t._v(" ルートユーザーの管理")]),t._v(" "),r("p",[t._v("OrBITでは、ルートユーザーをプロジェクトに替わって厳重に管理します。"),r("br"),t._v("\n例えば、以下に代表される様々なセキュリティ要件に従って管理されています。")]),t._v(" "),r("ul",[r("li",[t._v("ハードウェアMFAデバイスを利用した多要素認証によるログイン")]),t._v(" "),r("li",[t._v("ハードウェアMFAデバイスの物理的な厳重管理")]),t._v(" "),r("li",[t._v("強力なパスワードポリシーに準拠したパスワードの設定")]),t._v(" "),r("li",[t._v("パスワードの秘匿化")])]),t._v(" "),r("p",[t._v("MFAデバイスによる多要素認証が必要であるため、必然的にプロジェクト側ではルートユーザーでのログインができません。"),r("br"),t._v(" "),r("a",{attrs:{href:"#%E3%83%AB%E3%83%BC%E3%83%88%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A7%E3%81%97%E3%81%8B%E5%AE%9F%E8%A1%8C%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84%E3%82%BF%E3%82%B9%E3%82%AF"}},[t._v("ルートユーザーでしか実行できないタスク")]),t._v("が必要になった際は、お手数ですが"),r("a",{attrs:{href:"#%E3%83%AB%E3%83%BC%E3%83%88%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A7%E3%81%AE%E4%BD%9C%E6%A5%AD%E4%BE%9D%E9%A0%BC"}},[t._v("ルートユーザーでの作業依頼")]),t._v("の手順にてお問い合わせください。")]),t._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),r("p",[t._v("一般的にルートユーザーのパスワードは以下の手順を踏めばリセットする事が可能です。")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_access-keys_retrieve.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「紛失したり忘れたりしたパスワードまたはアクセスキーのリセット」"),r("OutboundLink")],1)])]),t._v(" "),r("p",[t._v("しかし、ログインには上述の多要素認証が必要になるため、この手順を行ったとしてもプロジェクト側ではログインすることはできません。")]),t._v(" "),r("p",[t._v("尚、現時点ではルートユーザーのログイン権限をプロジェクト側に提供する予定はございません。")])]),t._v(" "),r("h3",{attrs:{id:"ルートユーザーでしか実行できないタスク"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ルートユーザーでしか実行できないタスク"}},[t._v("#")]),t._v(" ルートユーザーでしか実行できないタスク")]),t._v(" "),r("p",[t._v("例えば、以下のようなタスクはルートユーザーでしか実行することができません。")]),t._v(" "),r("ul",[r("li",[t._v("アカウント情報(連絡先・支払い方法など)の変更")]),t._v(" "),r("li",[t._v("サポートプランの変更")]),t._v(" "),r("li",[t._v("CloudFrontキーペアの作成")]),t._v(" "),r("li",[t._v("アカウントの解約")])]),t._v(" "),r("p",[t._v("タスクの詳細については以下を参照してください。")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws_tasks-that-require-root.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「AWSアカウントのルートユーザーの認証情報が必要なAWSタスク」"),r("OutboundLink")],1)])]),t._v(" "),r("h3",{attrs:{id:"ルートユーザーでの作業依頼"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ルートユーザーでの作業依頼"}},[t._v("#")]),t._v(" ルートユーザーでの作業依頼")]),t._v(" "),r("p",[r("a",{attrs:{href:"#%E3%83%AB%E3%83%BC%E3%83%88%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A7%E3%81%97%E3%81%8B%E5%AE%9F%E8%A1%8C%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84%E3%82%BF%E3%82%B9%E3%82%AF"}},[t._v("ルートユーザーでしか実行できないタスク")]),t._v("が必要になった際は、以下のフォームから作業依頼を申請する事ができます。")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"/request/update-env"}},[t._v("「アカウント情報の変更依頼」")])]),t._v(" "),r("li",[r("a",{attrs:{href:"/request/update-support"}},[t._v("「サポートプラン変更依頼」")])]),t._v(" "),r("li",[r("a",{attrs:{href:"/request/destroy-env"}},[t._v("「アカウント解約依頼」")])])]),t._v(" "),r("p",[t._v("また、上記以外の作業依頼については、"),r("a",{attrs:{href:"/request/other"}},[t._v("「その他作業依頼」")]),t._v("から行う事ができます。")])])}),[],!1,null,null,null);a.default=v.exports}}]);