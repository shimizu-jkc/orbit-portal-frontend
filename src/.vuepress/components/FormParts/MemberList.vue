<template>
  <div id="MemberList">
    <div id="EditableMemberList" v-if="!readOnly"> 
      <el-row :gutter="4">
        <span class="member-header">
          <el-col :span="1">管理者</el-col>
          <el-col :span="8">所属部署名</el-col>
          <el-col :span="6">名前</el-col>
          <el-col :span="8">Eメールアドレス</el-col>
        </span>
      </el-row>
      <member 
        v-for="(member, index) in members"
        :key="index"
        :index="index"
        :id="id"
        :added="member.added ? true : false"
      />
      <el-button 
        class="button-row"
        type="primary" 
        icon="el-icon-plus" circle
        @click="onClickAdd()"
      ></el-button>
    </div>
    <div id="ReadOnlyMemberList" v-else> 
      <el-table 
        v-if="members.length>0" 
        :data="members" 
        size="small"
      >
        <el-table-column prop="Admin" label="管理者" width="100" :formatter="adminFormatter"></el-table-column>
        <el-table-column prop="Department" label="所属部署名"></el-table-column>
        <el-table-column prop="Name" label="名前"></el-table-column>
        <el-table-column prop="Email" label="Eメールアドレス"></el-table-column>
      </el-table>
      <el-row v-else>
        <span class="form-item">メンバーが登録されていません。</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import MemberItem from './MemberItem';

export default {
  name : "MemberList",
  components: {
    member: MemberItem
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
    members() {
      if(!this.id || this.id.length === 0){
        console.log(this.id, "CREATE")
        //Create
        return this.$store.state.p.createParams.Members;
      }else if(this.id && !this.readOnly){
        //Update
        console.log(this.id, "UPDATE")
        return this.$store.state.p.updateParams.Members;
      }else{
        //Read
        const project = this.$store.getters.getProjectById(this.id);
        return project ? project.Members : [];
      }
    }
  },
  methods: {
    onClickAdd(){
      this.$store.commit((this.id && !this.readOnly) ? "setUpdateParams":"setCreateParams", {name: "Member::ADD"});
    },
    adminFormatter(row, column){
      return row.Admin ? "はい" : "いいえ";
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
.member-header {
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