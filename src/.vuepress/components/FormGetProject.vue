<template>
  <div id="GetProject">
    <p-basic/>
    <el-row>
      <el-button type="primary" @click="onGetBtnClick($event)">確認する</el-button>
    </el-row>
  </div>
</template>

<script>
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'
  
export default {
  components: {
    'p-basic': ProjectBasicAuth
  },
  methods: {
    onGetBtnClick(event) {
      console.log(event)
    }
  }
}
</script>