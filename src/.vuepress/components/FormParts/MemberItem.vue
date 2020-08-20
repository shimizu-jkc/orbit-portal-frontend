<template>
  <div id="MemberItem">
    <el-row :gutter="4">
      <el-col :span="1" class="checkbox-col">
        <el-checkbox 
          v-model="admin"
        ></el-checkbox>
      </el-col>  
      <el-col :span="8">
        <el-input
          type="text"
          placeholder="所属部署名を入力してください"
          v-model="department"
        ></el-input>
      </el-col>  
      <el-col :span="6">
        <el-input 
          type="text"
          placeholder="名前を入力してください"
          v-model="name"
        ></el-input>
      </el-col>  
      <el-col :span="8" class="email-col">
        <el-input 
          v-if="isEditable"
          type="text"
          placeholder="Eメールアドレスを入力してください"
          v-model="email"
        ></el-input>
        <span class="email" v-else>{{email}}</span>
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
    added: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    //Store processing
    department: {
      get(){ return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].Members[this.index].Department },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Member::Department", val: value, index: this.index}) }
    },
    name: {
      get(){ return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].Members[this.index].Name },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Member::Name", val: value, index: this.index}) }
    },
    email: {
      get(){ return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].Members[this.index].Email },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Member::Email", val: value, index: this.index}) }
    },
    admin: {
      get(){ return this.$store.state.p[this.isUpdate ? "updateParams":"createParams"].Members[this.index].Admin },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Member::Admin", val: value, index: this.index}) }
    },
    isCreate(){ return this.id.length == 0 },
    isUpdate(){ return this.id.length > 0 },
    isEditable(){ return this.isCreate || (this.isUpdate && this.added) }
  },
  methods: {
    onClickDelete(){
      this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {name: "Member::DELETE", index: this.index});
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