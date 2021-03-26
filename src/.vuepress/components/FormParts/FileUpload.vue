<template>
  <div id="FileUpload">
    <files v-model="uploadList" :clickable="false" deletable upload></files>
    <el-upload
      class="file-upload"
      multiple
      action
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :file-list="fileList"
    >
      <el-button type="primary" icon="el-icon-upload" :size="buttonSize">ファイルを追加</el-button>
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
    buttonSize: {
      type: String,
      default: ""
    },
    maxSize: {
      type: Number,
      default: 100 * 1000 * 1000
    },
    beforeAdd: Function,
    onError: Function,
  },
  data() {
    return {
      fileList: this.value
    };
  },
  computed: {
    uploadList: {
      get() {
        return this.value.map(v => v.name);
      },
      set(val) {
        this.fileList = this.value.filter(v => val.includes(v.name));
      }
    }
  },
  methods: {
    handleFileChange(file) {
      if (this.fileList.some(f => f.name === file.name)) {
        this.onError && this.onError("同名のファイルは指定できません。");
        this.fileList = [...this.fileList];
        return;
      }
      if (file.size > this.maxSize) {
        this.onError && this.onError("ファイルサイズが大きすぎます。");
        this.fileList = [...this.fileList];
        return;
      }
      if (this.fileList.length >= this.limit){
        this.onError && this.onError(`申請できるファイルは${this.limit}つまでです。`);
        this.fileList = [...this.fileList];
        return;
      }
      if (this.beforeAdd && !this.beforeAdd(file.name, this.fileList)) {
        this.fileList = [...this.fileList];
        return;
      }
      // Add
      this.fileList = [...this.fileList, file];
    },
    handleFileRemove(file, fileList) {
      // Remove
      this.fileList = fileList;
    }
  },
  watch: {
    fileList(val) {
      // update parent
      this.$emit("input", val);
    },
  },
};
</script>

<style scoped>
.file-upload {
  margin-top: 0px;
}
</style>