<template>
  <div id="FormShowProject">
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="onClickEdit()">編集する</el-button>
    </el-row>
    <p-info operation="show" :id="id"/>
  </div>
</template>

<script>
import ProjectInfo from './FormParts/ProjectInfo.vue'
  
export default {
  name: "FormShowProject",
  components: {
    "p-info": ProjectInfo
  },
  data() {
    return {
      id: this.$route.query.id,
    };
  },
  methods: {
    onClickEdit() {
      this.$router.push({
        path: "update-project.html",
        query: { id: this.id }
      });
    }
  }
}
</script>