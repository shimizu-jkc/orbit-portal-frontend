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
      <el-form-item label="作業ID" v-if="isReadOnly">
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
        <span class="form-item">{{getDispName("TicketStatus", ticket.Status)}}</span>
      </el-form-item>
      <el-form-item label="作業種別">
        <el-select 
          class="select-type"
          v-model="type" 
          v-if="isEditable('type')"
          placeholder="依頼する作業の種別を選択してください。"
        >
          <el-option
            v-for="(item, index) in getDispNameSets('TicketType')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispName("TicketType", ticket.Type)}}
          <span class="attention" v-show="operation=='update'">※作業種別は変更できません</span>
        </span>
      </el-form-item>
      <div id="TicketContent">
        <simple v-if="isShowContent('REQ_CF_KEYPAIR')" type="REQ_CF_KEYPAIR" :readOnly="isReadOnly" :id="id"/>
        <simple v-if="isShowContent('REQ_OTHER')" type="REQ_OTHER" :readOnly="isReadOnly" :id="id"/>
        <audit v-if="isShowContent('REQ_AUDIT_LOG')" :readOnly="isReadOnly" :id="id"/>
        <plan v-if="isShowContent('REQ_SUPPORT_PLAN_CHANGE')" :readOnly="isReadOnly" :id="id"/>
      </div>
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
import TicketContentAuditLog from './TicketContent/TicketContentAuditLog';
import TicketContentPlanChange from './TicketContent/TicketContentPlanChange';
import TicketContentSimple from './TicketContent/TicketContentSimple';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";

export default {
  name: "TicketInfo",
  components : {
    audit: TicketContentAuditLog,
    plan: TicketContentPlanChange,
    simple: TicketContentSimple
  },
  mixins: [Util, Disp],
  props: {
    operation: {
      type: String,
      default: "show",
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
        this.$router.push({ path: "get-tickets.html" });
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
    isShowContent(){
      return (type) => {
        return ((this.isReadOnly ? this.ticket.Type : this.type) === type);
      }
    },
    needTicket() { return this.isShow || this.isUpdate },
    isReadOnly(){ return this.isShow || this.isDelete },
    isCreate(){ return this.operation === "create" },
    isShow(){ return this.operation === "show" },
    isUpdate(){ return this.operation === "update" },
    isDelete(){ return this.operation === "delete" }
   },
   methods: {}
}
</script>

<style scoped>
</style>
<style>
.el-select {
  width: 35%
}
.attention {
  margin-left: 1.5em;
  font-size: 80%;
  color: red;
}
.form-item {
  padding: 0 16px;
}
</style>