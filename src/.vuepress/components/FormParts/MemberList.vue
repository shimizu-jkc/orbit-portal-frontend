<template>
  <div id="MemberList">
    <div id="EditableMemberList" v-if="!readOnly"> 
      <el-row :gutter="3">
        <div class="member-header">
          <el-col :span="2">管理者
            <hint v-show="!readOnly">
              プロジェクト管理者にすると、プロジェクト情報の更新や削除を行うことができます。<br>
              少なくとも 1 人以上をプロジェクト管理者にしてください。<br>
              詳細は
              <el-link type="primary" href="/request/manual/create-project.html#管理者" target="_blank">こちら</el-link>
              を参照してください。
            </hint>
          </el-col>
          <el-col :span="8">所属部署名</el-col>
          <el-col :span="5">名前</el-col>
          <el-col :span="8">Eメールアドレス
            <hint v-show="hasId && !readOnly">
              メンバーのEメールアドレスは編集できません。<br>
              Eメールアドレスを編集する場合は、メンバーを削除してから再度追加してください。
            </hint>
          </el-col>
        </div>
      </el-row>
      <member
        class="member-row"
        ref="member"
        v-for="(member, index) in members"
        :key="index"
        :index="index"
        :id="id"
        :disabled="checkDisabled(member)"
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
        <el-table-column prop="Admin" label="管理者" align="center" width="80" >
          <template slot-scope="scope">
            <i v-if="scope.row.Admin" class="el-icon-check"></i>
          </template>
        </el-table-column>
        <el-table-column prop="Department" label="所属部署名" sortable></el-table-column>
        <el-table-column prop="Name" label="名前"></el-table-column>
        <el-table-column prop="Email" label="Eメールアドレス"></el-table-column>
      </el-table>
      <el-row v-else>
        <span class="form-item">プロジェクトメンバーが登録されていません。</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import MemberItem from './MemberItem';
import ItemHint from '../common/ItemHint';

export default {
  name : "MemberList",
  components: {
    member: MemberItem,
    hint: ItemHint
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
      if(this.hasId && this.readOnly){
        //Read
        const project = this.$store.getters.getProjectById(this.id);
        return project ? project.Members : this.$store.getters.getDummyProject().Members;
      }else if(this.hasId && !this.readOnly){
        //Update
        return this.$store.state.p.updateParams.Members;
      }else{
        //Create
        return this.$store.state.p.createParams.Members;
      }
    },
    hasId(){ return this.id.length > 0 }
  },
  methods: {
    checkDisabled(member){
      return {
        admin: false,
        department: false,
        name: false,
        email: (this.hasId && !member.added)
      };
    },
    async onClickAdd(){
      this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::ADD"});
    },
    validate(){
      let messages = [];
      if(this.$refs["member"].map(m => m.validate()).some(v => v.length > 0)){
        messages.push("プロジェクトメンバーの入力内容を確認してください。");
        return messages;
      }
      if(!this.members.length){
        messages.push("少なくとも1人以上のプロジェクトメンバーを登録してください。");
      }
      if(!this.members.some(m => m.Admin)){
        messages.push("少なくとも1人以上のプロジェクトメンバーを管理者にしてください。");
      }
      if(this.members.some(m => this.members.filter(mm => m.Email === mm.Email).length > 1)){
        messages.push("プロジェクトメンバーのEメールアドレスが重複しています。");
      }
      return messages;
    }
  }
}
</script>

<style scoped>
.member-row {
  margin: 1px;
}
.button-row {
  margin-top: 1.5em;
}
</style>
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
  font-size: 90%;
  text-align: center;
}
</style>
