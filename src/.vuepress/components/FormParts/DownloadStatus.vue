<template>
  <div id="DownloadStatus">
    <div :class="{error: isError}">{{message}}</div>
    <el-progress
      text-inside
      :stroke-width="12"
      :percentage="progress"
      :status="status"
    ></el-progress>
  </div>
</template>

<script>
export default {
  name: "DownloadStatus",
  props: {
    status: {
      type: String,
      default: "success"
    },
    progress: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: ""
    }
  },
  computed: {
    isError() {
      return this.status !== "success";
    }
  }
};
</script>

<style scoped>
.error {
  color: #F56C6C;
}
</style>