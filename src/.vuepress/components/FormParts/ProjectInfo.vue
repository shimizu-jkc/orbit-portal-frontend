<template>
  <div id="ProjectInfo">
    <el-form label-position="top">
      <div id="BasicInfo" v-show="isShowBasicInfo()">
        <el-form-item label="プロジェクト名">
          <el-input 
            type="text"
            placeholder="プロジェクトの名称を入力してください"
            v-model="projectName"
            v-if="isEditable('projectName')"
            minlength=1
            maxlength=20
            show-word-limit
          ></el-input>
          <span v-else>
            {{result.projectName}}
            <span class="attention" v-show="operation=='update'">プロジェクト名は編集できません</span>
          </span>
        </el-form-item>
        <el-form-item label="代表者Eメールアドレス">
          <el-input 
            type="text"
            v-if="isEditable('projectEmail')"
            placeholder="プロジェクト代表者のEメールアドレスを入力してください"
            v-model="projectEmail"
          ></el-input>
          <span v-else>{{result.projectEmail}}</span>
        </el-form-item>
      </div>
      <div id="ExtInfo" v-show="isShowExtInfo()">
        <el-form-item label="事業部">
          <el-select class="select"
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
          <span v-else>
            {{result.division}}
            <span class="attention" v-show="operation=='update'">事業部は編集できません</span>
          </span>
        </el-form-item>
        <el-form-item label="予算">
          <el-input-number class="input-number" 
            v-model="budget"
            v-if="isEditable('budget')"
            placeholder="予定している月額のクラウド利用料金を入力してください。"
            controls-position="right"
            :step="10"
            :min="0" 
            :max="10000"
          ></el-input-number>
          <span v-else>{{result.budget}}</span>
        </el-form-item>
        <members :readOnly="!isEditable('members')" />
      </div>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberList from './MemberList'

export default {
  name: "ProjectInfo",
  components :{
    members: MemberList
  },
  props: {
    operation: {
      type: String,
      default: "read",
      validator(value){
        return ["create","get","show","update","delete"].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      result : {
        projectName: this.$store.state.p.result.projectName,
        projectEmail: this.$store.state.p.result.projectEmail,
        division: this.$store.state.p.result.division,
        budget: this.$store.state.p.result.budget
      }
    }
  },
  computed: {
    projectName: {
      get() { return this.$store.state.p.projectName},
      set(value){ this.$store.commit('setProjectName', value) }
    },
    projectEmail: {
      get() { return this.$store.state.p.projectEmail},
      set(value){ this.$store.commit('setProjectEmail', value) }
    },
    division: {
      get() { return this.$store.state.p.division},
      set(value){ this.$store.commit('setDivision', value) }
    },
    budget: {
      get() { return this.$store.state.p.budget},
      set(value){ this.$store.commit('setBudget', value) }
    }
  },
  methods:{
    isShowBasicInfo(){
      switch(this.operation){
        default : return true;
      };
    },
    isShowExtInfo(){
      switch(this.operation){
        case "create":
        case "show":
        case "update": return true;
        default: return false;
      };    
    },
    isEditable(target){
      switch(this.operation){
        case "create": return true;
        case "update":
          switch(target){
            case "projectEmail":
            case "budget":
            case "members": return true;
            default: return false;
          }
        case "get":
        case "delete":
          switch(target){
            case "projectName":
            case "projectEmail": return true;
            default: return false;
          }
        default: return false;
      }
    }
  }
}
</script>

<style>
.select {
  width: 60%
}
.input-number {
  width: 30%
}
.attention {
  font-size: 80%;
  color: red;
}
</style>