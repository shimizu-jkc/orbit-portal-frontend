<template>
  <el-row :gutter="3">
    <el-col :span="2" class="checkbox-col">
      <el-checkbox v-model="admin" v-if="!isDisabled('admin')"></el-checkbox>
      <el-checkbox v-model="admin" disabled v-else></el-checkbox>
    </el-col>  
    <el-col :span="8">
      <span v-if="!isDisabled('department')">
        <el-tooltip
          :disabled="!error.department"
          :content="error.department">
          <el-input        
            type="text"
            placeholder="所属部署名を入力してください"
            v-model="department"
            @blur="onBlur('department')"
            :class="{error: error.department}"
          ></el-input>
        </el-tooltip>
      </span>
      <span v-else>{{department}}</span>
    </el-col>  
    <el-col :span="5">
      <span v-if="!isDisabled('name')">
        <el-tooltip
          :disabled="!error.name"
          :content="error.name">
          <el-input 
            type="text"
            placeholder="名前を入力してください"
            v-model="name"
            @blur="onBlur('name')"
            :class="{error: error.name}"
          ></el-input>
        </el-tooltip>
      </span>
      <span v-else>{{name}}</span>
    </el-col>  
    <el-col :span="8" class="email-col">
      <span v-if="!isDisabled('email')">
        <el-tooltip
          :disabled="!error.email"
          :content="error.email">
          <el-input
            type="text"
            placeholder="Eメールアドレスを入力してください"
            v-model="email"
            maxlength=254
            @blur="onBlur('email')"
            :class="{error: error.email}"
          ></el-input>
        </el-tooltip>
      </span>
      <span v-else>{{email}}</span>
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
</template>

<script>
import Util from "../../mixins/util";

export default {
  name : "MemberItem",
  mixins: [Util],
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      default: ""
    },
    disabled: {
      type: Object,
      default: function(){
        return {
          department: false,
          name: false,
          email: false,
          admin: false
        };
      }
    }
  },
  data() {
    return {
      error: {
        department: "",
        name: "",
        email: ""
      }
    }
  },
  computed: {
    //Store processing
    department: {
      get(){ return this.$store.state.p[this.hasId ? "updateParams":"createParams"].Members[this.index].Department },
      set(value){ this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::Department", val: value, index: this.index}) }
    },
    name: {
      get(){ return this.$store.state.p[this.hasId ? "updateParams":"createParams"].Members[this.index].Name },
      set(value){ this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::Name", val: value, index: this.index}) }
    },
    email: {
      get(){ return this.$store.state.p[this.hasId ? "updateParams":"createParams"].Members[this.index].Email },
      set(value){ this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::Email", val: value, index: this.index}) }
    },
    admin: {
      get(){ return this.$store.state.p[this.hasId ? "updateParams":"createParams"].Members[this.index].Admin },
      set(value){ this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::Admin", val: value, index: this.index}) }
    },
    hasId(){ return this.id.length > 0 },
  },
  methods: {
    isDisabled(attr){
      return this.disabled.hasOwnProperty(attr) ? this.disabled[attr] : true;
    },
    async onClickDelete(){
      this.$store.commit(this.hasId ? "setProjectUpdateParams":"setProjectCreateParams", {name: "Member::DELETE", index: this.index});
    },
    async onBlur(attr){
      this.error[attr] = this.validateMessage(attr);
    },
    validateMessage(attr){
      let message = "";
      switch(attr) {
        case "department":
          if(!this.department){
            message = "必須項目です";
          }
          break;
        case "name":
          if(!this.name){
            message = "必須項目です";
          }
          break;
        case "email":
          if(!this.email){
            message = "必須項目です";
          }else if(!this.getEmailPattern().test(this.email)){
            message = "不正な形式です";
          }
          break;
      }
      return message;
    },
    validate(){
      // whether member has no errors
      return Object.keys(this.error).map(k => this.error[k] = this.validateMessage(k)).every(e => !e);
    }
  }
}
</script>

<style scoped>
.checkbox-col {
  text-align: center;
  vertical-align: middle; 
}
.email-col {
  text-align: center;
}
</style>

<style>
.error .el-input__inner {
  border-color: #F56C6C;
}
</style>