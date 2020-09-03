<template>
  <el-row :gutter="3">
    <el-col :span="2" class="checkbox-col">
      <el-checkbox v-model="admin" v-if="!isDisabled('admin')"></el-checkbox>
      <el-checkbox v-model="admin" disabled v-else></el-checkbox>
    </el-col>  
    <el-col :span="8">
      <el-input
        v-if="!isDisabled('department')"
        type="text"
        placeholder="所属部署名を入力してください"
        v-model="department"
      ></el-input>
      <span v-else>{{department}}</span>
    </el-col>  
    <el-col :span="5">
      <el-input 
        v-if="!isDisabled('name')"
        type="text"
        placeholder="名前を入力してください"
        v-model="name"
      ></el-input>
      <span v-else>{{name}}</span>
    </el-col>  
    <el-col :span="8" class="email-col">
      <el-input
        v-if="!isDisabled('email')"
        type="text"
        placeholder="Eメールアドレスを入力してください"
        v-model="email"
      ></el-input>
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
export default {
  name : "MemberItem",
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