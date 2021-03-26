<template>
  <span id="ItemHint">
    <el-tooltip :placement="placement">
      <div slot="content" class="hint">
        <slot/>
      </div>
      <i :class="icon"></i>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  name: "ItemHint",
  props: {
    placement: {
      type: String,
      default: "top"
    },
    icon: {
      type: String,
      default: "el-icon-info"
    }
  },
};
</script>

<style>
.hint .el-link {
  vertical-align: baseline;
}
</style>