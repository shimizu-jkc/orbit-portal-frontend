<template>
  <div id="FileList">
    <el-row v-for="filename in value">
      <span v-show="deletable">
        <el-button
          v-if="upload"
          size="mini"
          round
          type="info"
          icon="el-icon-close"
          @click="onDelete(filename)"
        >取消</el-button>
        <el-button
          v-else
          size="mini"
          round
          type="danger"
          icon="el-icon-delete"
          @click="onDelete(filename)"
        >削除</el-button>
      </span>
      <span class="file-item">
        <i v-if="upload" class="el-icon-upload2"></i>
        <i v-else class="el-icon-document"></i>
        <el-button
          v-if="clickable"
          type="text"
          @click="onClick(filename)"
        >{{filename}}</el-button>
        <span v-else >{{filename}}</span>
      </span>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "FileList",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    clickable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false      
    },
    upload: {
      type: Boolean,
      default: false      
    }
  },
  methods: {
    onClick(filename) {
      this.$emit("click", filename);
    },
    onDelete(filename) {
      this.$emit("input", this.value.filter(v => v !== filename));
    }
  }
};
</script>

<style scoped>

</style>