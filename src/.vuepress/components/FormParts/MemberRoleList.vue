<template>
  <div id="MemberRoleList">
    <el-form label-position="top">
      <el-form-item label="役割の割り当て">
        <el-row :gutter="4">
          <div id="ListHeader" class="header">
            <el-col :span="9">Eメールアドレス</el-col>
            <el-col :span="6">名前</el-col>
            <el-col :span="8">役割</el-col>
          </div>
        </el-row>
        <role v-for="(role, index) in roles" :key="index" :index="index" />
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          icon="el-icon-plus" circle
          @click="onClickAdd()"
        ></el-button>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
import MemberRoleItem from './MemberRoleItem';

export default {
  name : "MemberRoleList",
  components: {
    "role": MemberRoleItem
  },
  computed: {
    roles(){
      return this.$store.state.a.roles 
    }
  },
  methods: {
    onClickAdd(){
      this.$store.commit('addMemberRole');
    }
  }
}
</script>

<style>
.header {
  font-size: 80%;
}
</style>