<template>
  <div id="MemberRoleList">
    <div id="EditableMemberRoleList" v-if="!readOnly"> 
      <el-row :gutter="4">
        <span class="role-header">
          <el-col :span="6">名前</el-col>
          <el-col :span="9">Eメールアドレス</el-col>
          <el-col :span="8">役割</el-col>
        </span>
      </el-row>
      <role 
        v-for="(role, index) in roles"
        :key="index"
        :index="index"
        :id="id"
        :added="role.added ? true : false"
      />
      <el-button 
        class="button-row"
        type="primary" 
        icon="el-icon-plus" circle
        @click="onClickAdd()"
      ></el-button>
    </div>
    <div id="ReadOnlyMemberRoleList" v-else> 
      <el-table 
        v-if="roles.length>0" 
        :data="roles" 
        size="small"
      >
        <el-table-column prop="Name" label="名前"></el-table-column>
        <el-table-column prop="Email" label="Eメールアドレス"></el-table-column>
        <el-table-column prop="Role" label="役割" :formatter="roleFormatter"></el-table-column>
      </el-table>
      <el-row v-else>
        <span class="form-item">役割が割り当てられていません。</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import MemberRoleItem from './MemberRoleItem';

export default {
  name : "MemberRoleList",
  components: {
    role: MemberRoleItem
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  computed: {
    roles() {
      if(!this.id || this.id.length === 0){
        //Create
        return this.$store.state.a.createParams.MemberRoles;
      }else if(this.id && !this.readOnly){
        //Update
        return this.$store.state.a.updateParams.MemberRoles;
      }else{
        //Read
        const account = this.$store.getters.getAccountById(this.id);
        return account ? account.MemberRoles : [];
      }
    }
  },
  methods: {
    onClickAdd(){
      this.$store.commit((this.id && !this.readOnly) ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::ADD"});
    },
    roleFormatter(row){
      switch(row.Role){
        case "PROJECT_MNGR"     : return "プロジェクト責任者";
        case "COST_MNGR"        : return "請求管理者";
        case "SECURITY_MNGR"    : return "セキュリティ担当者";
        case "PRIV_OPERATOR"    : return "特権運用者";
        case "OPERATOR"         : return "運用者";
        case "DB_MNGR"          : return "データベース管理者";
        case "PRIV_DEVELOPER"   : return "特権開発者";
        case "DEVELOPER"        : return "開発者";
        case "GUEST"            : return "ゲスト"
        default                 : return "不明な状態";
      }
    }
  }
}
</script>

<style>
table {
  margin: 0
}
.el-table th{
  background-color: #EEEEEE;
}
.el-table tr{
  background-color: #FFFFFF;
}
.role-header {
  font-size: 80%;
  text-align: center;
}
.button-row {
  margin-top: 1.5em;
}
.form-item {
  padding: 0 16px;
}
</style>