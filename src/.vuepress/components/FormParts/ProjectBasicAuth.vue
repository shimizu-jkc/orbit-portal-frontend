<template>
  <el-form ref="form" :model="form">
    <el-form-item label="プロジェクト名">
      <el-input 
        type="text"
        placeholder="プロジェクトの名称を入力してください"
        v-model="form.projectName"
        minlength=1
        maxlength=20
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="プロジェクトEメールアドレス">
      <el-input 
        type="text"
        placeholder="プロジェクト代表者のEメールアドレスを入力してください"
        v-model="form.projectEmail"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          projectName: '',
          projectEmail: ''
        }
      }
    }
  }
</script>