<template>
  <div id="TicketInfo">
    <el-form 
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditable('page')?'top':'left'"
    >
      <el-form-item label="プロジェクト名" v-if="isReadOnly">
        <span class="form-item">{{ticket.OwnerProjectId}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境ID" v-if="isReadOnly">
        <span class="form-item">{{ticket.OwnerAccountId}}</span>
      </el-form-item>
      <el-form-item label="管理者作業ID" v-if="isReadOnly">
        <span class="form-item">{{ticket.TicketId}}</span>
      </el-form-item>
      <el-form-item label="連絡先Eメールアドレス">
        <el-input 
          type="text"
          v-if="isEditable('email')"
          placeholder="作業の連絡先となるEメールアドレスを入力してください"
          v-model="email"
        ></el-input>
        <span class="form-item" v-else>{{ticket.TicketEmail}}</span>
      </el-form-item>
      <el-form-item label="ステータス" v-if="isReadOnly">
        <span class="form-item">{{getDispStatusName(ticket.Status)}}</span>
      </el-form-item>
      <el-form-item label="作業種別">
        <el-select 
          class="select-type"
          v-model="type" 
          v-if="isEditable('type')"
          placeholder="依頼する作業の種別を選択してください。"
        >
          <el-option label="CloudFrontキーペアの作成" value="REQ_CF_KEYPAIR"></el-option>
          <el-option label="監査ログの確認" value="REQ_AUDIT_LOG"></el-option>
          <el-option label="サポートプランの変更" value="REQ_SUPPORT_PLAN_CHANGE"></el-option>
          <el-option label="その他の作業" value="REQ_OTHER"></el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispTypeName(ticket.Type)}}
          <span class="attention" v-show="operation=='update'">※チケット種別は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="作業内容">
        <keypair v-if="type=='REQ_CF_KEYPAIR'"/>
        <audit v-if="type=='REQ_AUDIT_LOG'"/>
        <plan v-if="type=='REQ_SUPPORT_PLAN_CHANGE'"/>
        <other v-if="type=='REQ_OTHER'"/>
      </el-form-item>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(ticket.CreatedAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(ticket.UpdatedAt)}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import TicketContentCfKeypair from './TicketContentCfKeypair';
import TicketContentAuditLog from './TicketContentAuditLog';
import TicketContentPlanChange from './TicketContentPlanChange';
import TicketContentOther from './TicketContentOther';
import Util from "../../mixins/util";

export default {
  name: "TicketInfo",
  components : {
    keypair: TicketContentCfKeypair,
    audit: TicketContentAuditLog,
    plan: TicketContentPlanChange,
    other: TicketContentOther
 },
  mixins: [Util],
  props: {
    operation: {
      type: String,
      default: "read",
      validator(value){
        return ["create","get","show","update","delete"].indexOf(value) !== -1;
      }
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {}
  },
  computed: {
    //for display
    ticket() {
      const ticket = this.$store.getters.getTicketById(this.id);
      if(!ticket && this.needTicket){
        this.$router.push({ path: "get-ticket.html" });
        return this.$store.getters.getDummyTicket();
      }else{
        return ticket;
      }
    },
    //Store processing
    email: {
      get() { return this.$store.state.t[this.isUpdate ? "updateParams":"createParams"].TicketEmail },
      set(value){ this.$store.commit(this.isUpdate ? "setTicketUpdateParams":"setTicketCreateParams", {name: "TicketEmail", val: value}) }
    },
    type: {
      get() { return this.$store.state.t[this.isUpdate ? "updateParams":"createParams"].Type },
      set(value){ this.$store.commit(this.isUpdate ? "setTicketUpdateParams":"setTicketCreateParams", {name: "Type", val: value}) }
    },
    isEditable(){
      return (target) => {
        switch(this.operation){
          case "create": return true;
          case "update": {
            switch(target){
              case "page":
              case "email":
              case "content": return true;
              default: return false;
            }
          }
          case "get":
          case "show":  
          case "delete":
          default: return false;
        }
      }
    },
    needTicket() { return this.isShow || this.isUpdate },
    isReadOnly(){ return this.isShow || this.isDelete },
    isCreate(){ return this.operation === "create" },
    isShow(){ return this.operation === "show" },
    isUpdate(){ return this.operation === "update" },
    isDelete(){ return this.operation === "delete" }
   },
   methods:{
    getDispStatusName(val){
      switch(val){
        case "OPEN"             : return "新規";
        case "PROCESSING"       : return "作業中";
        case "COMPLETE"         : return "作業終了";
        case "CLOSED"           : return "完了";
        default                 : return "不明な状態";
      }
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 30%
}
</style>
<style>
.attention {
  margin-left: 1.5em;
  font-size: 80%;
  color: red;
}
.form-item {
  padding: 0 16px;
}
</style>