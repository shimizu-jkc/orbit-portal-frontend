<template>
  <div id="ScreenTransitionBtn">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClick()">{{btnName}}</el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "ScreenTransitionBtn",
  props: ["btnName", "path"],
  methods: {
    async onClick(){
      this.$router.back();
    }
  }
}
</script>