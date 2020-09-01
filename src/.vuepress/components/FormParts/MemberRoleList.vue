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
import Disp from "../../mixins/disp";

export default {
  name : "MemberRoleList",
  components: {
    role: MemberRoleItem
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