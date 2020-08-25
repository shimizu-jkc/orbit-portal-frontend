<template>
  <div id="FormShowAccount">
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="onClickEdit()">編集する</el-button>
    </el-row>
    <a-info operation="show" :id="id"/>
  </div>
</template>

<script>
import AccountInfo from './FormParts/AccountInfo.vue'
  
export default {
  name: "FormShowAccount",
  components: {
    "a-info": AccountInfo
  },
  data() {
    return {
      id: this.$route.query.id,
    };
  },
  methods: {
    onClickEdit() {
      this.$router.push({
        path: "update-account.html",
        query: { id: this.id }
      });
    }
  }
}
</script>