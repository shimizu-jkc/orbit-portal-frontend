(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{309:function(t,a,e){"use strict";e.r(a);var r=e(9),s=Object(r.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"利用開始にあたって"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#利用開始にあたって"}},[t._v("#")]),t._v(" 利用開始にあたって")]),t._v(" "),e("p",[t._v("OrBITは、Amazon Web Service (以下、AWSと呼びます) の利用をサポートしています。"),e("br"),t._v("\nここでは、AWSでの利用開始にあたり、前提となる条件や注意事項などを記載しています。")]),t._v(" "),e("p"),e("div",{staticClass:"table-of-contents"},[e("ul",[e("li",[e("a",{attrs:{href:"#前提知識"}},[t._v("前提知識")])]),e("li",[e("a",{attrs:{href:"#前提条件"}},[t._v("前提条件")])]),e("li",[e("a",{attrs:{href:"#制限"}},[t._v("制限")])]),e("li",[e("a",{attrs:{href:"#注意事項"}},[t._v("注意事項")])]),e("li",[e("a",{attrs:{href:"#サポートリージョン"}},[t._v("サポートリージョン")])])])]),e("p"),t._v(" "),e("h2",{attrs:{id:"前提知識"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前提知識"}},[t._v("#")]),t._v(" 前提知識")]),t._v(" "),e("p",[t._v("ユーザーガイドを読み進めるにあたり、クラウドおよびAWSに関する基礎的な知識を要求します。"),e("br"),t._v("\n学習する際は、以下のようなサイトを参考にしてください。")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://business.ntt-east.co.jp/content/cloudsolution/column-37.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「AWS入門　初心者が覚えておくべきAWSの基本」"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://aws.amazon.com/jp/aws-ten-reasons/",target:"_blank",rel:"noopener noreferrer"}},[t._v("「AWSのクラウドが選ばれる10の理由」"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://docs.aws.amazon.com/ja_jp/general/latest/gr/glos-chap.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("「AWSの用語集」"),e("OutboundLink")],1)])]),t._v(" "),e("h2",{attrs:{id:"前提条件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前提条件"}},[t._v("#")]),t._v(" 前提条件")]),t._v(" "),e("p",[t._v("OrBITをAWSで利用するためには、以下の前提条件を満たしている必要があります。")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("プロジェクトとしての体制が構築されている。")]),t._v(" "),e("p",[t._v("OrBITは、基本的にはプロジェクト単位での利用を想定しています。"),e("br"),t._v("\n払い出しの際には、プロジェクト名やプロジェクト責任者の連絡先の登録が必要になります。"),e("br"),t._v("\n個人による利用についてはサポートしておりません。")])]),t._v(" "),e("li",[e("p",[t._v("クラウド利用料金の配賦先が明確になっている。")]),t._v(" "),e("p",[t._v("AWSの利用には料金が発生します。"),e("br"),t._v("\nこの料金は、基本的にプロジェクト側の経費となりますので、事前に予算の確保をお願いします。"),e("br"),t._v("\nまた、AWSアカウントの払い出しの際には、配賦先となる部門コードおよび科目コードの登録が必要になります。")]),t._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),e("p",[t._v("どの程度の予算を確保するかは、サービスの規模やアーキテクチャによって大きく変わります。どのように見積ればよいのか不明な場合はご相談ください。")])])])]),t._v(" "),e("h2",{attrs:{id:"制限"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#制限"}},[t._v("#")]),t._v(" 制限")]),t._v(" "),e("p",[t._v("OrBITから提供されるAWSアカウントは、一般的に払い出したアカウントとは異なり、以下の制限があります。")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("ルートユーザーでのログイン、および操作ができません。")]),t._v(" "),e("p",[t._v("ルートユーザは、OrBITコアシステムにより厳重に管理されるため、プロジェクト側ではログインすることができません。詳細については、"),e("a",{attrs:{href:"/guide/aws/account-management#%E3%83%AB%E3%83%BC%E3%83%88%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC"}},[t._v("「ルートユーザーについて」")]),t._v("を参照してください。")])]),t._v(" "),e("li",[e("p",[t._v("いくつかのAWSサービスに関しての操作が禁止されます。")]),t._v(" "),e("p",[t._v("OrBITでは、定義したセキュリティポリシーに準拠するため、いくつかのAWSサービスにおける操作が禁止されています。詳細については、"),e("a",{attrs:{href:"/guide/aws/security#%E7%89%B9%E5%AE%9A%E3%81%AE%E6%93%8D%E4%BD%9C%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E5%88%B6%E9%99%90"}},[t._v("「特定の操作に対する制限」")]),t._v("を参照して下さい。")])])]),t._v(" "),e("div",{staticClass:"custom-block warning"},[e("p",{staticClass:"custom-block-title"},[t._v("ATTENTION")]),t._v(" "),e("p",[t._v("これらの制限は基本的に緩和することはできません。")])]),t._v(" "),e("h2",{attrs:{id:"注意事項"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#注意事項"}},[t._v("#")]),t._v(" 注意事項")]),t._v(" "),e("p",[t._v("OrBITを利用する上での注意事項です。")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("通常の利用分に加え、OrBITが提供するリソースの利用分の料金が別途掛かります。")]),t._v(" "),e("p",[t._v("OrBITでは、様々な支援をプロジェクトへ提供するため、プロジェクトアカウントに対して、いくつかのリソースをプロビジョニングします。そのリソースおよびサービスの利用に掛かる料金は、プロジェクト側で負担して頂きます。")]),t._v(" "),e("p",[t._v("ただし、これらのリソースおよびサービスは、一般的にAWSを利用する場合でも有効にすることが多いため、OrBITを利用しない場合でも有効にすることを推奨します。")]),t._v(" "),e("p",[e("a",{attrs:{href:"/guide/aws/baseline#%E3%83%99%E3%83%BC%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%B3%E3%81%AE%E5%88%A9%E7%94%A8%E6%96%99%E9%87%91"}},[t._v("「ベースラインの利用料金」")]),t._v("にて、いくつかのプロジェクトにおける利用料金の内訳を載せていますので、参考にしてください。")])])]),t._v(" "),e("h2",{attrs:{id:"サポートリージョン"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#サポートリージョン"}},[t._v("#")]),t._v(" サポートリージョン")]),t._v(" "),e("p",[t._v("OrBITがサポートするリージョンは以下になります。")]),t._v(" "),e("table",[e("thead",[e("tr",[e("th",{staticStyle:{"text-align":"center"}},[t._v("リージョン名")]),t._v(" "),e("th",{staticStyle:{"text-align":"center"}},[t._v("地域")])])]),t._v(" "),e("tbody",[e("tr",[e("td",{staticStyle:{"text-align":"center"}},[t._v("us-east-1")]),t._v(" "),e("td",{staticStyle:{"text-align":"center"}},[t._v("米国東部 (バージニア北部)")])]),t._v(" "),e("tr",[e("td",{staticStyle:{"text-align":"center"}},[t._v("us-east-2")]),t._v(" "),e("td",{staticStyle:{"text-align":"center"}},[t._v("米国東部 (オハイオ)")])]),t._v(" "),e("tr",[e("td",{staticStyle:{"text-align":"center"}},[t._v("us-west-2")]),t._v(" "),e("td",{staticStyle:{"text-align":"center"}},[t._v("米国西部 (オレゴン)")])]),t._v(" "),e("tr",[e("td",{staticStyle:{"text-align":"center"}},[t._v("eu-west-1")]),t._v(" "),e("td",{staticStyle:{"text-align":"center"}},[t._v("欧州 (アイルランド)")])])])]),t._v(" "),e("div",{staticClass:"custom-block warning"},[e("p",{staticClass:"custom-block-title"},[t._v("ATTENTION")]),t._v(" "),e("p",[t._v("サポートリージョン以外のリージョンを利用したい場合は、"),e("a",{attrs:{href:"/request/create-env"}},[t._v("「クラウド環境の払い出し申請」")]),t._v("にて、追加リージョンとして選択できます。"),e("br"),t._v("\nただし、追加リージョンとして選択せずに、サポートリージョン以外のリージョンを利用した場合、OrBITが提供するメリットを受けることはできません。")])]),t._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[t._v("INFO")]),t._v(" "),e("p",[t._v("サポートリージョンが限定されているのは、OrBITコアシステムで利用しているAWSサービスに起因しています。当該AWSサービスのアップデートに伴い、OrBITのサポートリージョンも追加していく予定です。")])])])}),[],!1,null,null,null);a.default=s.exports}}]);