<template>
  <div id="FormShowProject">
    <p-info operation="show"/>
    <el-row>
      <el-button type="primary" @click="onClickEdit()">編集する</el-button>
    </el-row>
  </div>
</template>

<script>
import ProjectInfo from './FormParts/ProjectInfo.vue'
  
export default {
  name: "FormShowProject",
  components: {
    "p-info": ProjectInfo
  },
  methods: {
    onClickEdit() {
      this.$router.push("/request/update-project");
    }
  }
}
</script>