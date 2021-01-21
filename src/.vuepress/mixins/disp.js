// Common for display mixin
const DispNameTable = {
  Division: [
    { value: "CORP" , label: "コーポレート" },
    { value: "AM"   , label: "AM事業部" },
    { value: "MS"   , label: "MS事業部" },
    { value: "PS"   , label: "PS事業部" },
    { value: "DX"   , label: "DX事業部" } 
  ],
  Env: [
    { value: "PRD", label: "本番" },
    { value: "STG", label: "ステージング" },
    { value: "DEV", label: "開発" },
    { value: "POC", label: "概念検証" }
  ],
  AccountStatus: [
    { value: "WAITING_CONFIRM"  , label: "承認待ち" },
    { value: "CONFIRM"          , label: "承認済み" },
    { value: "REJECT"           , label: "却下" },
    { value: "PREPARING"        , label: "準備中" },
    { value: "CREATE_START"     , label: "作成開始" },
    { value: "CREATING"         , label: "作成中" },
    { value: "CREATE_FAILED"    , label: "作成失敗" },
    { value: "CREATE_COMPLETED" , label: "作成済み" },
    { value: "AVAILABLE"        , label: "有効" },
    { value: "WAITING_DELETE"   , label: "削除待ち" },
    { value: "DELETE_START"     , label: "削除中" },
    { value: "DELETE_COMPLETED" , label: "削除済み" }
  ],
  MemberRole: [
    { value: "PROJECT_MNGR"   , label: "クラウド環境責任者" },
    { value: "COST_MNGR"      , label: "請求管理者" },
    { value: "SECURITY_MNGR"  , label: "セキュリティ担当者" },
    { value: "PRIV_OPERATOR"  , label: "特権運用者" },
    { value: "OPERATOR"       , label: "運用者" },
    { value: "DB_MNGR"        , label: "データベース管理者" },
    { value: "PRIV_DEVELOPER" , label: "特権開発者" },
    { value: "DEVELOPER"      , label: "開発者" },
    { value: "GUEST"          , label: "ゲスト" }
  ],
  TicketType: [
//  { value: "REQ_CF_KEYPAIR"          , label: "CloudFrontキーペアの作成" },
    { value: "REQ_AUDIT_LOG"           , label: "監査ログの確認" }, 
    { value: "REQ_SUPPORT_PLAN_CHANGE" , label: "サポートプランの変更" }, 
    { value: "REQ_OTHER"               , label: "その他の作業" }
  ],
  TicketStatus: [
    { value: "OPEN"       , label: "新規" }, 
    { value: "PROCESSING" , label: "作業中" }, 
    { value: "COMPLETE"   , label: "作業終了" }, 
    { value: "CLOSED"     , label: "完了" }
  ],
  ServiceForAudit: [
    { value: "AWS_CONFIG"     , label: "AWS Config" }, 
    { value: "AWS_CLOUDTRAIL" , label: "Amazon CloudTrail" }
  ],
  SupportPlan: [
    { value: "BUSINESS" , label: "ビジネス" },
    { value: "DEVELOPER" , label: "デベロッパー" },
    { value: "BASIC"     , label: "ベーシック" } 
  ]
};

export default {
  methods: {
    //for Display name
    getDispName(attrName, attrValue){
      try{
        if(!attrName || attrName.length == 0 || !attrValue || attrValue.length == 0){
          return "";
        }else{
          return DispNameTable[attrName].find(d => d.value === attrValue).label;
        }
      }catch(e){
        console.error(`${attrName}:${attrValue} is invalid`);
        return "不明な表示名"
      }
    },
    getDispNameSets(attrName){
      try{
        if(!attrName || attrName.length == 0){
          return { value: "", label: "" };   
        }else{
          return DispNameTable[attrName];
        }
      }catch(e){
        console.error(`${attrName} is invalid`);
        return { value: "UNKNOWN", label: "不明な表示名" };   
      }
    }
  },
  computed: {
    //for Display state
    isEditable(){ return this.isCreate || this.isUpdate },
    isExist()   { return this.isShow || this.isUpdate || this.isDelete },
    isReadOnly(){ return this.isShow || this.isDelete },
    isCreate()  { return this.operation ? (this.operation === "create") : false },
    isShow()    { return this.operation ? (this.operation === "show") : false },
    isUpdate()  { return this.operation ? (this.operation === "update") : false },
    isDelete()  { return this.operation ? (this.operation === "delete") : false },
  }
}