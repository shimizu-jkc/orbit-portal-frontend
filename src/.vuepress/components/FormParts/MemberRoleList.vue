<template>
  <div id="MemberRoleList">
    <div id="EditableMemberRoleList" v-if="!readOnly"> 
      <el-row :gutter="4">
        <span class="role-header">
          <el-col :span="6">名前</el-col>
          <el-col :span="9">Eメールアドレス</el-col>
          <el-col :span="8">役割
            <hint>
              役割の詳細は
              <el-link type="primary" href="/guide/aws/service/id-management.html#役割の一覧" target="_blank">こちら</el-link>
              を参照してください。
            </hint>
          </el-col>
        </span>
      </el-row>
      <role
        class="role-row"
        ref="role"
        v-for="(role, index) in roles"
        :key="index"
        :index="index"
        :id="id"
        :members="members"
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
        <el-table-column prop="Role" label="役割" :formatter="roleFormatter" sortable></el-table-column>
      </el-table>
      <el-row v-else>
        <span class="form-item">役割が割り当てられていません。</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import MemberRoleItem from './MemberRoleItem';
import ItemHint from '../common/ItemHint';
import Disp from "../../mixins/disp";

export default {
  name : "MemberRoleList",
  components: {
    role: MemberRoleItem,
    hint: ItemHint
  },
  mixins: [Disp],
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
      if(this.hasId && this.readOnly){
        //Read
        const account = this.$store.getters.getAccountById(this.id);
        return account ? account.MemberRoles : this.$store.getters.getDummyAccount().MemberRoles;
      }else if(this.hasId && !this.readOnly){
        //Update
        return this.$store.state.a.updateParams.MemberRoles;
      }else{
        //Create
        return this.$store.state.a.createParams.MemberRoles;
      }
    },
    members() {
      const project = this.$store.getters.getProjectById(this.$store.state.c.auth.ProjectId);
      if(project){
        return project.Members;
      }else{
        return this.$store.getters.getDummyProject().Members;
      }
    },
    hasId(){ return this.id.length > 0 }
  },
  methods: {
    async onClickAdd(){
      this.$store.commit(this.hasId ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::ADD"});
    },
    roleFormatter(row, column, value) {
      return this.getDispName("MemberRole", value)
    },
    validate(){
      let messages = [];
      if(this.$refs["role"].map(r => r.validate()).some(v => v.length > 0)){
        messages.push("プロジェクトメンバーの役割の入力内容を確認してください。");
        return messages;
      }
      const pmCount = this.roles.filter(r => r.Role === "PROJECT_MNGR").length;
      if(pmCount === 0){
        messages.push("「クラウド環境責任者」の役割を1人に割り当ててください。");
      }
      if(pmCount > 1){
        messages.push("「クラウド環境責任者」の役割は1人だけ割り当ててください。");
      }
      if(this.roles.some(r => this.roles.filter(rr => r.Email === rr.Email && r.Role === rr.Role).length > 1)){
        messages.push("同じプロジェクトメンバーに同じ役割が割り当てられています。");
      }
      return messages;
    }
  }
}
</script>

<style scoped>
table {
  margin: 0
}
.el-table th{
  background-color: #EEEEEE;
}
.el-table tr{
  background-color: #FFFFFF;
}
.role-row {
  margin: 1px;
}
.button-row {
  margin-top: 1.5em;
}
</style>
<style>
.role-header {
  font-size: 90%;
  text-align: center;
}
</style>