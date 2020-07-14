<template>
  <div id="MemberList">
    <el-form label-position="top">
      <el-form-item label="メンバー">
        <el-row :gutter="4">
          <span class="header">
            <el-col :span="8">所属部署名</el-col>
            <el-col :span="6">名前</el-col>
            <el-col :span="9">Eメールアドレス</el-col>
          </span>
        </el-row>
        <member 
          v-if="!readOnly"
          v-for="(member, index) in members"
          :key="index"
          :index="index" 
        />
        <ul v-else>
          <el-row :gutter="4" v-if="isExist()" v-for="member in result.members">
            <el-col :span="8">{{member.department}}</el-col>
            <el-col :span="6">{{member.name}}</el-col>
            <el-col :span="9">{{member.email}}</el-col>
          </el-row>
          <el-row v-else>
            <el-col>メンバーが登録されていません。</el-col>
          </el-row>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button 
          v-show="!readOnly"
          type="primary" 
          icon="el-icon-plus" circle
          @click="onClickAdd()"
        ></el-button>
      </el-form-item>
    </el-form> 
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
    }
  },
  data() {
    return {
      result : {
        members: this.$store.state.p.result.members  
      }
    }
  },
  computed: {
    members(){
      return this.$store.state.p.members
    }
  },
  methods: {
    onClickAdd(){
      this.$store.commit('addMember');
    },
    isExist(){
      return true;
      return (this.members.length > 0 && this.members[0].name !== '');
    }
  }
}
</script>

<style>
.header {
  font-size: 80%;
}
</style>