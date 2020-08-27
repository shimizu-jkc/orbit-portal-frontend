<template>
  <div id="MemberRoleItem">
    <el-row :gutter="4">
      <el-col :span="6">
        <el-select 
          v-model="email" 
          placeholder="ユーザーを選択してください。"
        >
          <el-option
            v-for="member in members"
            :key="member.Email"
            :label="member.Name"
            :value="member.Email">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="email-col" :span="9">
        <span v-if="email.length>0">{{email}}</span>
        <div class="empty-content" v-else></div>
      </el-col>
      <el-col :span="8">
        <el-select 
          v-model="role" 
          placeholder="役割を選択してください。"
        >
          <el-option label="プロジェクト責任者" value="PROJECT_MNGR"></el-option>
          <el-option label="請求管理者" value="COST_MNGR"></el-option>
          <el-option label="セキュリティ担当者" value="SECURITY_MNGR"></el-option>
          <el-option label="特権運用者" value="PRIV_OPERATOR"></el-option>
          <el-option label="運用者" value="運用者"></el-option>
          <el-option label="データベース管理者" value="DB_MNGR"></el-option>
          <el-option label="特権開発者" value="PRIV_DEVELOPER"></el-option>
          <el-option label="開発者" value="DEVELOPER"></el-option>
          <el-option label="ゲスト" value="GUEST"></el-option>
        </el-select>
      </el-col>  
      <el-col :span="1">
        <el-button 
          size="mini"
          type="danger" 
          icon="el-icon-minus" circle
          @click="onClickDelete()"
        ></el-button>
      </el-col>  
    </el-row>
  </div>
</template>

<script>
export default {
  name : "MemberRoleItem",
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      default: ""
    },
    members: {
      type: Array,
      default: []
    },
    added: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {}
  },
  computed: {
    //Store processing
    name: {
      get(){ return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].MemberRoles[this.index].Name },
      set(value){ /* ReadOnly */ }
    },
    email: {
      get(){ return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].MemberRoles[this.index].Email },
      set(value){
        this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Email", val: value, index: this.index}) 
        this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Name", val: this.getMemberName(value), index: this.index}) 
      }
    },
    role: {
      get(){ return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].MemberRoles[this.index].Role },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Role", val: value, index: this.index}) }
    },
    isCreate(){ return this.id.length == 0 },
    isUpdate(){ return this.id.length > 0 },
    isEditable(){ return this.isCreate || (this.isUpdate && this.added) }
  },
  methods: {
    getMemberName(email){
      return this.members.find(m => m.Email === email).Name;
    },
    onClickDelete(){
      this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::DELETE", index: this.index});
    }
  }
}
</script>

<style scoped>
.el-select{
  width: 100%;
}
.email-col {
  text-align: center;
}
.empty-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>