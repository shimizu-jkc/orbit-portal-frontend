<template>
  <div id="FileUpload">
    <files v-model="uploadList" :clickable="false" deletable upload></files>
    <el-upload
      class="file-upload"
      multiple
      action
      :auto-upload="false"
      :show-file-list="false"
      :limit="limit"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :on-exceed="handleFileExceed"
      :file-list="value"
    >
      <el-button type="primary" icon="el-icon-upload">ファイルを追加</el-button>
    </el-upload>
  </div>
</template>

<script>
import FileList from "./FileList";

export default {
  name: "FileUpload",
  components: {
    files: FileList
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 3
    },
    maxSize: {
      type: Number,
      default: 100 * 1000 * 1000
    },
    beforeAdd: Function
  },
  computed: {
    uploadList: {
      get() {
        return this.value.map(v => v.name);
      },
      set(val) {
        this.$emit("input", this.value.filter(v => val.includes(v.name)));
      }
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      // Add
      const reject = fileList.slice(0, -1);
      if (this.value.some(f => f.name === file.name)) {
        this.$message.error("同名のファイルは指定できません。");
        this.$emit("input", reject);
        return;
      }
      if (file.size > this.maxSize) {
        this.$message.error("ファイルサイズが大きすぎます。");
        this.$emit("input", reject);
        return;
      }
      if (this.beforeAdd && !this.beforeAdd(file.name)) {
        this.$emit("input", reject);
        return;
      }
      this.$emit("input", fileList);
    },
    handleFileRemove(file, fileList) {
      // Remove
      this.$emit("input", fileList);
    },
    handleFileExceed(file, fileList) {
      this.$message.error(`申請できるファイルは${this.limit}つまでです。`);
    }
  }
};
</script>

<style scoped>
.file-upload {
  margin-top: 16px;
}
</style>