<template>
  <div id="TicketInfo">
    <el-form
      ref="form"
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditableAttr('page')?'top':'left'"
      :model="ticketModel"
      :rules="rules"
      :hide-required-asterisk="!isEditable"
    >
      <el-form-item label="作業ID" v-show="isExist">
        <span class="form-item">{{ticketId}}</span>
      </el-form-item>
      <el-form-item label="プロジェクト名">
        <span class="form-item">{{projectId}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境ID">
        <span class="form-item">{{accountId}}</span>
      </el-form-item>
      <el-form-item label="連絡先Eメールアドレス" prop="TicketEmail">
        <el-input 
          type="text"
          v-if="isEditableAttr('TicketEmail')"
          placeholder="作業の連絡先となるEメールアドレスを入力してください"
          v-model="email"
          maxlength=254
        ></el-input>
        <span class="form-item" v-else>{{email}}</span>
      </el-form-item>
      <el-form-item label="ステータス" v-if="isExist">
        <span class="form-item">{{getDispName("TicketStatus", status)}}</span>
      </el-form-item>
      <el-form-item label="作業種別" prop="Type">
        <el-select 
          v-model="type" 
          v-if="isEditableAttr('Type')"
          placeholder="依頼する作業の種別を選択してください"
        >
          <el-option
            v-for="(item, index) in getDispNameSets('TicketType')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispName("TicketType", type)}}
          <span class="attention" v-show="isUpdate">※作業種別は変更できません</span>
        </span>
      </el-form-item>
      <div id="TicketContent">
        <simple v-if="isShowContent('REQ_CF_KEYPAIR')" type="REQ_CF_KEYPAIR" :readOnly="isReadOnly" :id="id"/>
        <simple v-if="isShowContent('REQ_OTHER')" type="REQ_OTHER" :readOnly="isReadOnly" :id="id"/>
        <audit ref="content" v-if="isShowContent('REQ_AUDIT_LOG')" :readOnly="isReadOnly" :id="id"/>
        <plan ref="content" v-if="isShowContent('REQ_SUPPORT_PLAN_CHANGE')" :readOnly="isReadOnly" :id="id"/>
      </div>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(createdAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(updatedAt)}}</span>
      </el-form-item>
      <el-form-item label="登録者" v-if="isReadOnly">
        <span class="form-item">{{createdBy}}</span>
      </el-form-item>
      <el-form-item label="最終更新者" v-if="isReadOnly">
        <span class="form-item">{{updatedBy}}</span>
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
    simple: TicketContentSimple,
    audit: TicketContentAuditLog,
    plan: TicketContentPlanChange
  },
  mixins: [Util, Disp],
  props: {
    id: {
      type: String,
      default: ""
    },
    operation: {
      type: String,
      default: "show",
      validator(value){
        return ["create","show","update","delete"].indexOf(value) !== -1;
      }
    },
  },
  data() {
    return {
      rules: {
        TicketEmail: [
          { required: true, message: "連絡先Eメールアドレスは必須です。", trigger: "blur" },
          { pattern: this.getEmailPattern(), 
            message: "連絡先Eメールアドレスはメールアドレス形式で入力してください。", trigger: "blur" }
        ],
        Type: [
          { required: true, message: "作業種別は必須です。" }
        ]
      }
    }
  },
  computed: {
    //for display
    ticket() {
      if(this.id.length > 0){
        const ticket = this.$store.getters.getTicketById(this.id);
        if(!ticket){
          //this.$router.push({ path: "get-tickets.html" });
          return this.$store.getters.getDummyTicket();
        }else{
          return ticket;
        }
      }else{
        return this.$store.getters.getDummyTicket();
      }
    },
    ticketModel() {
      if(this.isCreate){
        return this.$store.state.t.createParams;
      }else if(this.isUpdate){
        return this.$store.state.t.updateParams;
      }else{
        return this.ticket;
      }
    },
    //Store processing
    getter() {
      return (attr, readOnly=false) => {
        if(this.isCreate && !readOnly){
          return this.$store.state.t.createParams[attr];
        }else if(this.isUpdate && this.isEditableAttr(attr)){
          return this.$store.state.t.updateParams[attr];
        }else{
          return this.ticket[attr];
        }
      }
    },
    setter(){
      return (val) => {
        if(this.isCreate){ 
          this.$store.commit("setTicketCreateParams", val);
        }else if(this.isUpdate){ 
          this.$store.commit("setTicketUpdateParams", val);
        }else{
          console.error(`${val} is not editable.`);
        }
      }
    },
    //Authenticated value
    projectId: {
      get() { return this.isCreate ? this.$store.state.c.auth.ProjectId : this.getter("OwnerProjectId", true) },
    },
    accountId: {
      get() { return this.isCreate ? this.$store.state.c.auth.AccountId : this.getter("OwnerAccountId", true) },
    },
    //ReadOnly value
    ticketId: { 
      get() { return this.getter("TicketId", true); }
    },
    status: {
      get() { return this.getter("Status", true); },
    },
    createdAt: {
      get() { return this.getter("CreatedAt", true); },
    },
    updatedAt: {
      get() { return this.getter("UpdatedAt", true); },
    },
    createdBy: {
      get() { return this.getter("CreatedBy", true); },
    },
    updatedBy: {
      get() { return this.getter("UpdatedBy", true); },
    },
    //Editable value
    email: {
      get() { return this.getter("TicketEmail"); },
      set(value){ this.setter({ name: "TicketEmail", val: value }); }
    },
    type: {
      get() { return this.getter("Type"); },
      set(value){ this.setter({ name: "Type", val: value }); }
    },
    //Check processing
    isEditableAttr(){
      return (target) => {
        switch(this.operation){
          case "create": 
              case "page":
              case "TicketEmail":
              case "Type":
              case "Content": return true;
          case "update": {
            switch(target){
              //case "page":
              case "TicketEmail":
              case "Content": return true;
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
        return (this.type === type);
      }
    }
  },
  methods: {
    async validate() {
      return new Promise((resolve, reject) => {
        // el-form validator
        this.$refs["form"].validate(async (valid, detail) => {
          const format = (messages) => {
            return messages.map(m => "・" + m).join("\n");
          };
          let messages = [];
          // check form
          Object.keys(detail).forEach(d => {
            if(this.isEditableAttr(d)){
              messages.push(detail[d][0].message);
            }
          });
          // Check content form
          if(this.$refs["content"]){
            messages = messages.concat(await this.$refs["content"].validate());
          }
          if(!messages.length){
            resolve();
          }else{
            reject(new Error(format(messages)));
          }
        });
      });
    }
  },
  created(){
    // Return to the auth page when reloading
    if(this.id && !this.$store.getters.getTicketById(this.id)){
      this.$router.push({ path: "get-tickets.html" });
      return;
    }
    // Return to the auth page when query is empty
    if(this.isExist && !this.id){
      this.$router.push({ path: "get-tickets.html" });
      return;
    }
  }
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