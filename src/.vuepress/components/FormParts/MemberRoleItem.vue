<template>
  <el-row :gutter="4">
    <el-col :span="6">
      <el-select 
        v-model="email"
        placeholder="ユーザーを選択してください。"
      >
        <el-option
          v-for="member in members"
          :key="member.Email"
          :label="member.Name"
          :value="member.Email">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="email-col" :span="9">
      <span v-if="email.length>0">{{email}}</span>
      <div class="empty-content" v-else></div>
    </el-col>
    <el-col :span="8">
      <el-select 
        v-model="role" 
        placeholder="役割を選択してください。"
      >
        <el-option
          v-for="(item, index) in getDispNameSets('MemberRole')"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
import Disp from "../../mixins/disp";

export default {
  name : "MemberRoleItem",
  mixins: [Disp],
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      default: ""
    },
    members: {
      type: Array,
      default: []
    },
  },
  data(){
    return {}
  },
  computed: {
    //Store processing
    name: {
      get(){ return this.$store.state.a[this.hasId ? "updateParams":"createParams"].MemberRoles[this.index].Name },
      set(value){ /* ReadOnly */ }
    },
    email: {
      get(){ return this.$store.state.a[this.hasId ? "updateParams":"createParams"].MemberRoles[this.index].Email },
      set(value){
        this.$store.commit(this.hasId ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Email", val: value, index: this.index}) 
        this.$store.commit(this.hasId ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Name", val: this.getMemberName(value), index: this.index}) 
      }
    },
    role: {
      get(){ return this.$store.state.a[this.hasId ? "updateParams":"createParams"].MemberRoles[this.index].Role },
      set(value){ this.$store.commit(this.hasId ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::Role", val: value, index: this.index}) }
    },
    hasId(){ return this.id.length > 0 }
  },
  methods: {
    getMemberName(email){
      return this.members.find(m => m.Email === email).Name;
    },
    async onClickDelete(){
      this.$store.commit(this.hasId ? "setAccountUpdateParams":"setAccountCreateParams", {name: "MemberRole::DELETE", index: this.index});
    }
  }
}
</script>

<style scoped>
.el-select{
  width: 100%;
}
.email-col {
  text-align: center;
}
.empty-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>