/**** リストにナレッジを追加する場合は以下の定義値を利用して下さい ****/
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
const TYPE = {
  KNOW: "ナレッジ",
  ARCH: "アーキテクチャ",
  TMPL: "テンプレート",
  TOOL: "ツール",
  OTHER: "その他"
};
const ENV = {
  AWS: "AWS",
  GITHUB: "GitHub",
  ANY: "指定なし",
  OTHER: "その他"
};
const LINK = {
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL"
};

/**** 内部定義 *****/
const DEFAULT_PATH = "/knowledge/items";

/**** ナレッジを追加する場合は、以下のリストに追加してください ****/
module.exports = [

  //20210409 add by shimizu
  {
    Id      : "UserManagement",
    Name    : "ユーザー認証とユーザ管理機能を実現するためのアーキテクチャ",
    Phase   : PHASE.CODE,
    Type    : TYPE.ARCH,
    Env     : ENV.AWS,
    Author  : "shimizu.yusuke53@jvckenwood.com",
    Link    : {
      Type  : LINK.INTERNAL,
      Path  : `${DEFAULT_PATH}/user-management`
    }
  },
  //20210409 add by shimizu
  {
    Id      : "LoadTest",
    Name    : "クラウド上で実行可能な負荷試験ツール",
    Phase   : PHASE.TEST,
    Type    : TYPE.TOOL,
    Env     : ENV.AWS,
    Author  : "tanaka.kodai@jvckenwood.com",
    Link    : {
      Type  : LINK.INTERNAL,
      Path  :  `${DEFAULT_PATH}/loadtest`
    }
  },
  //20210409 add by shimizu
  {
    Id      : "DevContainer",
    Name    : "コンテナを利用した共通開発環境の構築",
    Phase   : PHASE.CODE,
    Type    : TYPE.TOOL,
    Env     : ENV.ANY,
    Author  : "kaniwa.teruaki@jvckenwood.com",
    Link    : {
      Type  : LINK.EXTERNAL,
      Url   : `https://github.com/jkc-cloud/orbit-dev-container`
    }
  },
  //20210409 add by shimizu
  {
    Id      : "ImageScan",
    Name    : "コンテナイメージの脆弱性を自動でスキャンするCI/CD",
    Phase   : PHASE.BUILD,
    Type    : TYPE.KNOW,
    Env     : ENV.GITHUB,
    Link    : {
      Type  : LINK.INTERNAL,
      Path  : `${DEFAULT_PATH}/image-scan`
    }
  }
];