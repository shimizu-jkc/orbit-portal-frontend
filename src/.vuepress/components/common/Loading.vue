<template>
  <div id="Loading">
    <div
      v-loading.fullscreen.lock="show"
      :element-loading-text="message"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    message: {
      type: String,
      default: "処理中です"
    }
  }
}
</script>