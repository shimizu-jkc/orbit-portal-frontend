<template>
  <div id="ProjectInfo">
    <el-form 
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditable('page')?'top':'left'"
    >
      <el-form-item label="プロジェクト名">
        <el-input 
          type="text"
          placeholder="プロジェクトの名称を入力してください"
          v-model="projectId"
          v-if="isEditable('projectName')"
          minlength=1
          maxlength=20
          show-word-limit
        ></el-input>
        <span class="form-item" v-else>
          {{project.ProjectId}}
          <span class="attention" v-show="operation=='update'">※プロジェクト名は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="代表者Eメールアドレス">
        <el-input 
          type="text"
          v-if="isEditable('projectEmail')"
          placeholder="プロジェクト代表者のEメールアドレスを入力してください"
          v-model="projectEmail"
        ></el-input>
        <span class="form-item" v-else>
          {{project.ProjectEmail}}
        </span>
      </el-form-item>
      <el-form-item label="事業部">
        <el-select 
          class="select"
          v-model="division" 
          v-if="isEditable('division')"
          placeholder="所属する事業部を選択してください。"
        >
          <el-option label="コーポレート" value="CORP"></el-option>
          <el-option label="AM事業部" value="AM"></el-option>
          <el-option label="MS事業部" value="MS"></el-option>
          <el-option label="PS事業部" value="PS"></el-option>
          <el-option label="DX事業部" value="DX"></el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispDivisionName(project.DivisionName)}}
          <span class="attention" v-show="operation=='update'">※事業部は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="クラウド利用の予算(月額)">
        <div id="EditableBudget" v-if="isEditable('budget')">
          <el-input-number 
            class="input-number"
            v-model="budget"
            placeholder="予定している月毎のクラウド利用料金を入力してください。"
            :step="10"
            :min="0" 
            :max="10000"
          ></el-input-number>
          <span> USD </span>
        </div>
        <span class="form-item" v-else>
          {{project.Budget}} USD
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトメンバー">
        <div class="form-item">
          <members :readOnly="!isEditable('members')" :id="id"/>
        </div>
      </el-form-item>
      <el-form-item label="所有アカウント" v-if="isReadOnly">
        <span class="form-item" v-for="account in project.AccountIds">
          {{account}}
        </span>
      </el-form-item>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(project.CreatedAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(project.UpdatedAt)}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberList from './MemberList';
import Util from "../../mixins/util";

export default {
  name: "ProjectInfo",
  components : {
    members: MemberList
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
    project() {
      const project = this.$store.getters.getProjectById(this.id);
      if(!project && this.needProject){
        this.$router.push({ path: "get-project.html" });
        return this.$store.getters.getDummyProject();
      }else{
        return project;
      }
    },
    //Store processing
    projectId: {
      get() { return this.$store.state.p.createParams.ProjectId },
      set(value){ this.$store.commit('setCreateParams', {name: "ProjectId", val: value}) }
    },
    projectEmail: {
      get() { return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].ProjectEmail },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "ProjectEmail", val: value}) }
    },
    division: {
      get() { return this.$store.state.p.createParams.DivisionName },
      set(value){ this.$store.commit('setCreateParams', {name: "DivisionName", val: value}) }
    },
    budget: {
      get() { return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].Budget },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Budget", val: value}) }
    },
    isEditable(){
      return (target) => {
        switch(this.operation){
          case "create": return true;
          case "update": {
            switch(target){
              case "page":
              case "projectEmail":
              case "budget":
              case "members": return true;
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
    isReadOnly(){ return this.isShow || this.isDelete },
    needProject() { return this.isShow || this.isUpdate },
    isCreate(){ return this.operation === "create" },
    isShow(){ return this.operation === "show" },
    isUpdate(){ return this.operation === "update" },
    isDelete(){ return this.operation === "delete" }
   },
   methods:{
    getDispDivisionName(val){
      switch(val){
        case "CORP": return "コーポレート";
        case "AM": return "AM事業部";
        case "MS": return "MS事業部";
        case "PS": return "PS事業部";
        case "DX": return "DX事業部";
        default : return "不明";
      }
    }
  }
}
</script>

<style>
.el-select {
  width: 30%
}
.el-input-number {
  width: 15%
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