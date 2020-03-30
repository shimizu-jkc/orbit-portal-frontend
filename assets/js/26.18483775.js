(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{314:function(t,r,_){"use strict";_.r(r);var v=_(9),a=Object(v.a)({},(function(){var t=this,r=t.$createElement,_=t._self._c||r;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("h1",{attrs:{id:"はじめに"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#はじめに"}},[t._v("#")]),t._v(" はじめに")]),t._v(" "),_("p",[t._v("現在、当社ではいくつかの製品やソリューションにおいて、パブリッククラウドを利用したサービスビジネスが進行しています。")]),t._v(" "),_("p",[t._v("しかし、クラウドを利用した開発や運用は、当社には馴染みが薄く、外部企業へ委託しているケースが多いのも事実です。")]),t._v(" "),_("p",[t._v("外部企業へ委託することにより、「サービスの構成を把握してる人がいない」「社内にノウハウが蓄積されない」といった課題を認識しているプロジェクトも多く、クラウド基盤チームではそのような課題を解決すべく、当社でのサービスビジネス内製、および準内製を実現するための体制や仕組み作りを検討しています。また、実際に幾つかのプロジェクトでは開発や運用の支援を行っています。")]),t._v(" "),_("p"),_("div",{staticClass:"table-of-contents"},[_("ul",[_("li",[_("a",{attrs:{href:"#orbitとは"}},[t._v("OrBITとは")])]),_("li",[_("a",{attrs:{href:"#orbitが提供する支援とは"}},[t._v("OrBITが提供する支援とは")]),_("ul",[_("li",[_("a",{attrs:{href:"#sorの側面における支援"}},[t._v("SoRの側面における支援")])]),_("li",[_("a",{attrs:{href:"#soeの側面における支援"}},[t._v("SoEの側面における支援")])])])]),_("li",[_("a",{attrs:{href:"#システム構成と構成要素"}},[t._v("システム構成と構成要素")]),_("ul",[_("li",[_("a",{attrs:{href:"#_1-orbitコアシステム"}},[t._v("1. OrBITコアシステム")])]),_("li",[_("a",{attrs:{href:"#_2-orbitカタログシステム"}},[t._v("2. OrBITカタログシステム")])]),_("li",[_("a",{attrs:{href:"#_3-orbitポータル"}},[t._v("3. OrBITポータル")])])])]),_("li",[_("a",{attrs:{href:"#セキュリティ責任の共有"}},[t._v("セキュリティ責任の共有")])]),_("li",[_("a",{attrs:{href:"#サポートするクラウドベンダ"}},[t._v("サポートするクラウドベンダ")])]),_("li",[_("a",{attrs:{href:"#ロードマップ"}},[t._v("ロードマップ")])]),_("li",[_("a",{attrs:{href:"#社内導入事例"}},[t._v("社内導入事例")])])])]),_("p"),t._v(" "),_("h2",{attrs:{id:"orbitとは"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#orbitとは"}},[t._v("#")]),t._v(" OrBITとは")]),t._v(" "),_("p",[_("RouterLink",{attrs:{to:"/guide/common/glossary.html#orbit-organization-s-cloud-baseline-integrated-with-devops-tools"}},[t._v("OrBIT")]),t._v(" ("),_("font",{attrs:{color:"blue"}},[_("strong",[t._v("Or")])]),t._v("ganization's cloud "),_("font",{attrs:{color:"blue"}},[_("strong",[t._v("B")])]),t._v("aseline "),_("font",{attrs:{color:"blue"}},[_("strong",[t._v("I")])]),t._v("ntegrated with devops "),_("font",{attrs:{color:"blue"}},[_("strong",[t._v("T")])]),t._v("ools)とは、"),_("br"),t._v("\n「技術開発部 要素技術グループ クラウド基盤開発チーム」が提供する、"),_("br"),t._v(" "),_("strong",[t._v("クラウドを利用したサービスの開発や運用を支援するための様々な仕組みを備える基盤")]),t._v("です。")],1),t._v(" "),_("p",[t._v("AWS、GCP、Azureなどに代表されるパブリッククラウドは、サービスビジネスを展開する上で、今や当たり前のように利用されています。しかし、実際にサービスをローンチするまでには、")]),t._v(" "),_("ul",[_("li",[_("strong",[t._v("クラウド環境の構築や整備")])]),t._v(" "),_("li",[_("strong",[t._v("アプリケーションの開発と継続的なリリース")])]),t._v(" "),_("li",[_("strong",[t._v("運用体制の構築と安定した運用の維持")])]),t._v(" "),_("li",[_("strong",[t._v("様々な脅威に対するセキュリティ対策")])])]),t._v(" "),_("p",[t._v("といった、様々な点を考慮する必要があり、また、それに応じたスキルを持つ人材や工数の確保が必要となります。")]),t._v(" "),_("p",[t._v("OrBITでは、パブリッククラウドを利用する上で、上述のような必ず必要となる様々な考慮事項に関して支援する仕組みを提供します。")]),t._v(" "),_("h2",{attrs:{id:"orbitが提供する支援とは"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#orbitが提供する支援とは"}},[t._v("#")]),t._v(" OrBITが提供する支援とは")]),t._v(" "),_("p",[t._v("一般的にサービスは、"),_("strong",[t._v("SoR(System of Record)")]),t._v(" や "),_("strong",[t._v("SoE(System of Engagement)")]),t._v(" といった設計思想に基づいた幾つかのシステムで構成されます。")]),t._v(" "),_("p",[_("strong",[t._v("SoR")]),t._v("と"),_("strong",[t._v("SoE")]),t._v("の設計思想には、以下のような違いがあります。")]),t._v(" "),_("table",[_("thead",[_("tr",[_("th",{staticStyle:{"text-align":"center"}}),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("SoR (System of Record)")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("SoE (System of Engagement)")])])]),t._v(" "),_("tbody",[_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("目的")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[_("strong",[t._v("記録する")]),t._v("ためのシステム")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[_("strong",[t._v("顧客とのつながり")]),t._v("を意識したシステム")])]),t._v(" "),_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("設計")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[_("strong",[t._v("正確性")]),t._v("、"),_("strong",[t._v("信頼性")]),t._v("、"),_("strong",[t._v("安定性")]),_("br"),t._v("が求められる")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[_("strong",[t._v("顧客からの活用を最大化すること")]),_("br"),t._v("が求められる")])]),t._v(" "),_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("システムの"),_("br"),t._v("適用範囲")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("サービスを始める際に必須となる"),_("br"),_("strong",[t._v("非差別的な領域")])]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("競合サービスと"),_("br"),_("strong",[t._v("差別化すべき領域")])])]),t._v(" "),_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("代表的な"),_("br"),t._v("システム")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("IT系主幹システムなど")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("SNSサービスなど")])])])]),t._v(" "),_("p",[t._v("OrBITでは、"),_("strong",[t._v("SoR")]),t._v("と"),_("strong",[t._v("SoE")]),t._v("の両側面に対して支援を提供します。")]),t._v(" "),_("h3",{attrs:{id:"sorの側面における支援"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#sorの側面における支援"}},[t._v("#")]),t._v(" SoRの側面における支援")]),t._v(" "),_("p",[_("strong",[t._v("SoR")]),t._v("に基づいたシステムでは、競合するサービスとの差別化を図ることができないため、この部分の構築や運用に対して、如何にコストを掛けないかが重要になります。")]),t._v(" "),_("p",[t._v("OrBITでは、クラウドを利用する際に必須となる"),_("strong",[t._v("手続きを代行する")]),t._v("ことや、"),_("strong",[t._v("統合的な管理体系")]),t._v("を提供することで、サービス開発、および運用のコストを抑えます。")]),t._v(" "),_("ul",[_("li",[t._v("クラウド環境の払い出しと初期セットアップの代行")]),t._v(" "),_("li",[t._v("クラウド環境の組織的な管理")]),t._v(" "),_("li",[t._v("統合的なユーザーIDの管理")]),t._v(" "),_("li",[t._v("利用料金の支払い処理の代行と社内配賦")]),t._v(" "),_("li",[t._v("セキュリティポリシーの定義と準拠するための仕組み")]),t._v(" "),_("li",[t._v("監査ログの集約とセキュアな保存")])]),t._v(" "),_("h3",{attrs:{id:"soeの側面における支援"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#soeの側面における支援"}},[t._v("#")]),t._v(" SoEの側面における支援")]),t._v(" "),_("p",[_("strong",[t._v("SoE")]),t._v("に基づいたシステムは、競合するサービスと差別化を図るために非常に重要であり、サービスの事業主が最もアイデアとリソースを集中すべき部分です。")]),t._v(" "),_("p",[t._v("OrBITでは、サービスを迅速に開発するための"),_("strong",[t._v("リファレンスアーキテクチャ")]),t._v("や、運用の手助けをする"),_("strong",[t._v("支援ツール")]),t._v("などを提供することで、アイデアに集中する時間を確保します。")]),t._v(" "),_("ul",[_("li",[t._v("汎用的に利用可能なリファレンスアーキテクチャの提供")]),t._v(" "),_("li",[t._v("DevOpsを促進するためのツールやテンプレートの提供")]),t._v(" "),_("li",[t._v("共通サービスの提供")]),t._v(" "),_("li",[t._v("事業部を跨いだデータ利活用プラットフォームの提供")])]),t._v(" "),_("div",{staticClass:"custom-block warning"},[_("p",{staticClass:"custom-block-title"},[t._v("ATTENTION")]),t._v(" "),_("p",[t._v("現在、OrBITで提供しているリファレンスアーキテクチャや支援ツールは多くはありません。"),_("br"),t._v("\nまた、共通サービスやプラットフォームも同様であり、今後の開発については"),_("a",{attrs:{href:"#%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9E%E3%83%83%E3%83%97"}},[t._v("ロードマップ")]),t._v("をご覧ください。")])]),t._v(" "),_("h2",{attrs:{id:"システム構成と構成要素"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#システム構成と構成要素"}},[t._v("#")]),t._v(" システム構成と構成要素")]),t._v(" "),_("p",[t._v("ここでは、OrBITがどのようなシステム構成で支援を提供しているかを説明します。")]),t._v(" "),_("CaptionedImage",{attrs:{src:"system_structure.png",caption:"システム構成"}}),t._v(" "),_("p",[t._v("OrBITは大きく分けて、3つのシステムにより構成されています。")]),t._v(" "),_("h3",{attrs:{id:"_1-orbitコアシステム"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_1-orbitコアシステム"}},[t._v("#")]),t._v(" 1. OrBITコアシステム")]),t._v(" "),_("p",[t._v("OrBITコアシステムは、"),_("strong",[t._v("SoR")]),t._v("の側面における支援を提供し、クラウド利用に関して全社的なガバナンスを維持することを目的としています。")]),t._v(" "),_("p",[t._v("本システムは、プロジェクト側に払い出したクラウド環境にプロビジョニングされたOrBITベースラインというリソースを介して連携することで支援を実現しています。")]),t._v(" "),_("h4",{attrs:{id:"orbitベースライン"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#orbitベースライン"}},[t._v("#")]),t._v(" OrBITベースライン")]),t._v(" "),_("p",[t._v("OrBITベースラインとは、OrBITから払い出されたすべてのクラウド環境に共通でプロビジョニングされるリソース群です。プロジェクト側のクラウド環境で収集した監査ログやセキュリティに関する情報を、OrBITコアシステムへ転送する仕組みを備えます。")]),t._v(" "),_("p",[t._v("プロビジョニングされるリソースは利用するクラウドベンダ毎に異なりますので、詳細については以下を参照してください。")]),t._v(" "),_("ul",[_("li",[_("a",{attrs:{href:"/guide/aws/baseline#%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E4%B8%80%E8%A6%A7"}},[t._v("「AWSにおけるベースラインのリソース一覧」")])])]),t._v(" "),_("h3",{attrs:{id:"_2-orbitカタログシステム"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_2-orbitカタログシステム"}},[t._v("#")]),t._v(" 2. OrBITカタログシステム")]),t._v(" "),_("p",[t._v("カタログとは、私たちが支援してきた様々な案件から得た知見や技術を、汎用的かつ簡単に利用することができるようにしたモノです。")]),t._v(" "),_("blockquote",[_("p",[t._v("カタログの詳細に関しては、"),_("a",{attrs:{href:"/catalog/introduction"}},[t._v("「カタログとは？」")]),t._v("を参照してください。")])]),t._v(" "),_("p",[t._v("OrBITカタログシステムは、カタログの検索手段や利用方法を提供し、"),_("strong",[t._v("SoE")]),t._v("の側面において支援します。"),_("br"),t._v("\nプロジェクト側は必要に応じて、セルフサービスでカタログを利用することができます。")]),t._v(" "),_("h3",{attrs:{id:"_3-orbitポータル"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_3-orbitポータル"}},[t._v("#")]),t._v(" 3. OrBITポータル")]),t._v(" "),_("p",[t._v("OrBITポータル(本サイト)は、OrBITの利用申請や問い合わせをする際の窓口となるシステムです。"),_("br"),t._v("\n本システムは、主に以下の機能を備えています。")]),t._v(" "),_("ul",[_("li",[_("p",[_("strong",[t._v("ユーザーガイド")])]),t._v(" "),_("p",[t._v("OrBITに関する利用方法やリファレンスなどを記述したマニュアルです。")])]),t._v(" "),_("li",[_("p",[_("strong",[t._v("各種申請機能")])]),t._v(" "),_("p",[t._v("クラウド環境やユーザーIDなど、OrBITが統合的に管理するリソースに対する、登録や変更を依頼するフォーム画面を提供します。")])]),t._v(" "),_("li",[_("p",[_("strong",[t._v("カタログ検索機能")])]),t._v(" "),_("p",[t._v("OrBITカタログシステムへアクセスし、プロジェクトが所望するカタログが提供されているかを検索することができ、該当するカタログが見つかった場合には、使い方や仕様を確認することができます。また、OrBIT開発チームに対して、改善要望やフィードバックを送ることができます。")])])]),t._v(" "),_("h2",{attrs:{id:"セキュリティ責任の共有"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#セキュリティ責任の共有"}},[t._v("#")]),t._v(" セキュリティ責任の共有")]),t._v(" "),_("p",[t._v("OrBITでは、各クラウドベンダの利用環境を提供しますが、そのクラウド環境に関するすべての責任を負う訳ではありません。"),_("br"),t._v("\nOrBITの各システムが提供するモノと、プロジェクト側で構築したモノを明確に分離し、お互いがそれぞれに対してセキュリティ責任を担う必要があります。")]),t._v(" "),_("p",[t._v("このようなセキュリティに関する考え方は、責任共有モデルと呼ばれます。")]),t._v(" "),_("p",[t._v("責任共有モデルとは、サービスの提供者側と利用者側の双方で役割を分け、セキュリティ全体に対する責任を担保しようとする考え方で、多くのパブリッククラウドでも採用されており、例えば、以下のようなセキュリティに対する考え方が、各社から示されています。")]),t._v(" "),_("ul",[_("li",[_("a",{attrs:{href:"https://aws.amazon.com/jp/compliance/shared-responsibility-model/",target:"_blank",rel:"noopener noreferrer"}},[t._v("「AWSの責任共有モデル」"),_("OutboundLink")],1)]),t._v(" "),_("li",[_("a",{attrs:{href:"https://cloud.google.com/security/overview?hl=ja",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Google Cloud Platformでのセキュリティとコンプライアンス」"),_("OutboundLink")],1)]),t._v(" "),_("li",[_("a",{attrs:{href:"https://docs.microsoft.com/ja-jp/azure/security/fundamentals/shared-responsibility",target:"_blank",rel:"noopener noreferrer"}},[t._v("「Azureにおける共同責任」"),_("OutboundLink")],1)])]),t._v(" "),_("p",[t._v("OrBITを利用していれば常に安心・安全であるというものではありません。"),_("br"),t._v("\n最低限のセキュリティに関する仕組みは提供しますが、プロジェクト側で構築したリソースや収集したデータの保護などのセキュリティ対策および責任に関しては、プロジェクト側で担って頂く点に注意してください。")]),t._v(" "),_("p",[t._v("以下は、OrBIT側とプロジェクト側のセキュリティとコンプライアンスの責任範囲を示しています。"),_("br"),t._v(" "),_("CaptionedImage",{attrs:{src:"shared_responsibility.png",caption:"OrBITとプロジェクトの責任共有モデル"}})],1),t._v(" "),_("div",{staticClass:"custom-block tip"},[_("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),_("p",[t._v("プロジェクト側で、具体的にどのようなセキュリティ対策を行えばよいのか不明な場合はご相談ください。")])]),t._v(" "),_("h2",{attrs:{id:"サポートするクラウドベンダ"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#サポートするクラウドベンダ"}},[t._v("#")]),t._v(" サポートするクラウドベンダ")]),t._v(" "),_("p",[t._v("現在、OrBITで利用することができるクラウドベンダは以下になります。"),_("br"),t._v("\n各クラウドベンダでの利用方法については、対応するユーザーガイドをご覧ください。")]),t._v(" "),_("ul",[_("li",[_("strong",[t._v("AWS")]),t._v(" (ユーザーガイドは"),_("a",{attrs:{href:"/guide/aws"}},[t._v("こちら")]),t._v(")")])]),t._v(" "),_("div",{staticClass:"custom-block tip"},[_("p",{staticClass:"custom-block-title"},[t._v("NOTE")]),t._v(" "),_("p",[t._v("クラウドベンダはプロジェクトで任意に選択することが可能です。"),_("br"),t._v("\nもし、どのクラウドベンダを選択するのがよいのか不明な場合はご相談ください。")])]),t._v(" "),_("h2",{attrs:{id:"ロードマップ"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ロードマップ"}},[t._v("#")]),t._v(" ロードマップ")]),t._v(" "),_("p",[t._v("OrBITでは、ご利用頂いている方からのフィードバックを受け取り、継続的にシステムの改善やカタログの拡充を行っています。是非、"),_("a",{attrs:{href:"/catalog/feedback"}},[t._v("こちら")]),t._v("からフィートバックをお願いします。")]),t._v(" "),_("p",[t._v("ここでは、現時点で予定しているOrBITの開発ロードマップを紹介します。")]),t._v(" "),_("CaptionedImage",{attrs:{src:"roadmap.png",caption:""}}),t._v(" "),_("h2",{attrs:{id:"社内導入事例"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#社内導入事例"}},[t._v("#")]),t._v(" 社内導入事例")]),t._v(" "),_("p",[t._v("OrBITは既に社内のいくつかの案件にてご利用頂いております。")]),t._v(" "),_("ImageContainer"),t._v(" "),_("Footer")],1)}),[],!1,null,null,null);r.default=a.exports}}]);