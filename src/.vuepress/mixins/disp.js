// Common for display mixin
const DispNameTable = {
  MemberRole: [
    { value: "PROJECT_MNGR"   , label: "プロジェクト責任者" },
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
    { value: "REQ_CF_KEYPAIR"          , label: "CloudFrontキーペアの作成" }, 
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
    getDispName(attrName, attrValue){
      try{
        return DispNameTable[attrName].find(d => d.value === attrValue).label;
      }catch(e){
        console.error(`${attrName}:${attrValue} is invalid`);
        return "不明な表示名"
      }
    },
    getDispNameSets(attrName){
      try{
        return DispNameTable[attrName];
      }catch(e){
        console.error(`${attrName} is invalid`);
        return { value: "UNKNOWN", label: "不明な表示名" };   
      }
    }
  }
}
