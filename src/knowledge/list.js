/**** リストにナレッジを追加する場合は以下の定義値を利用して下さい ****/

// Phase : ナレッジがDevSecOpsのどのフェーズに属するか
const PHASE = {
  PLAN: "PLAN",
  CODE: "CODE",
  BUILD: "BUILD",
  TEST: "TEST",
  RELEASE: "RELEASE",
  DEPLOY: "DEPLOY",
  OPERATE: "OPERATE",
  MONITOR: "MONITOR",
};
// Type : ナレッジがどの種別に分類されるか
const TYPE = {
  KNOW: "KNOW",   //ノウハウ
  ARCH: "ARCH",   //アーキテクチャ
  TMPL: "TMPL",   //テンプレート
  TOOL: "TOOL",   //ツール
  OTHER: "OTHER"  //その他
};
// Env : ナレッジはどの環境に適用可能か
const ENV = {
  AWS: "AWS",       //Amazon Web Service
  GITHUB: "GITHUB", //GitHub
  ANY: "ANY",       //環境非依存
  OTHER: "OTHER"    //その他
};
// Link : 参照先のリンク種別
const LINK = {
  INTERNAL: "INTERNAL", //内部リンク
  EXTERNAL: "EXTERNAL"  //外部リンク
};

/**** 内部で利用する定義値です。 *****/
const DEFAULT_PATH = "/knowledge/items";

/**** ナレッジを追加する場合は、以下のリストに追加してください。 ****/
const knowledgeList = [
  //20210409 add by shimizu
  {
    Id        : "UserManagement",
    Name      : "ユーザー認証と管理機能を実現するためのアーキテクチャ",
    Desc      : "このナレッジでは、Webサービスにおける一般的なユーザ認証機能とユーザー管理機能の設計方法とリファレンスを紹介しています。 ",
    Phase     : PHASE.CODE,
    Type      : TYPE.ARCH,
    Env       : ENV.AWS,
    Author    : "shimizu.yusuke53@jvckenwood.com",
    Link      : {
      Type    : LINK.INTERNAL,
      Path    : `${DEFAULT_PATH}/user-management/`
    },
    UpdatedAt : new Date("2021/4/9")
  },
  //20210409 add by shimizu
  {
    Id        : "LoadTest",
    Name      : "クラウド上で実行可能な負荷試験ツール",
    Desc      : "このナレッジでは、システムの負荷テストを実施する際に必要となるクライアント端末をAWS上で実行するための手順とツールを紹介しています。",
    Phase     : PHASE.TEST,
    Type      : TYPE.TOOL,
    Env       : ENV.AWS,
    Author    : "tanaka.kodai@jvckenwood.com",
    Link      : {
      Type    : LINK.INTERNAL,
      Path    : `${DEFAULT_PATH}/loadtest/`
    },
    UpdatedAt : new Date("2021/4/9")
  },
  //20210409 add by shimizu
  {
    Id        : "DevContainer",
    Name      : "コンテナを利用した共通開発環境の構築",
    Desc      : "プロジェクトが開発フェーズに入ると、「プロジェクトのメンバーが利用する開発環境を揃えたい」という要望を良く聞きます。このナレッジでは、Dockerを利用した共通開発環境の構築と運用手順について紹介しています。",
    Phase     : PHASE.CODE,
    Type      : TYPE.TOOL,
    Env       : ENV.ANY,
    Author    : "kaniwa.teruaki@jvckenwood.com",
    Link      : {
      Type    : LINK.EXTERNAL,
      Url     : `https://github.com/jkc-cloud/orbit-dev-container`
    },
    UpdatedAt : new Date("2021/4/9")
  },
  //20210409 add by shimizu
  {
    Id        : "ImageScan",
    Name      : "コンテナイメージの脆弱性を自動でスキャンするCI/CD",
    Desc      : "このナレッジでは、Dockerのコンテナイメージをスキャンし、脆弱性を検出するための一連の工程を自動化したCI/CDのパイプラインを紹介しています。",
    Phase     : PHASE.BUILD,
    Type      : TYPE.KNOW,
    Env       : ENV.GITHUB,
    Author    : "tanaka.kodai@jvckenwood.com",
    Link      : {
      Type    : LINK.INTERNAL,
      Path    : `${DEFAULT_PATH}/image-scan/`
    },
    UpdatedAt : new Date("2021/4/9")
  },
  {
    Id        : "Jest",
    Name      : "Jestを利用したテスト自動化環境の構築",
    Desc      : "このナレッジでは、JavaScriptのためのテストフレームワークであるJestの使い方と、Jestを利用したテスト自動化の方法を紹介しています。",
    Phase     : PHASE.TEST,
    Type      : TYPE.KNOW,
    Env       : ENV.GITHUB,
    Author    : "aoki.takeshi@jvckenwood.com",
    Link      : {
      Type    : LINK.INTERNAL,
      Path    : `${DEFAULT_PATH}/jest/`
    },
    UpdatedAt : new Date("2021/5/25")
  }
];

module.exports = knowledgeList;