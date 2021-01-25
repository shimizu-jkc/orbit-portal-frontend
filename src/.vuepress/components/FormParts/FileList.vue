<template>
  <div id="FileList">
    <div v-for="filename in value">
      <el-row>
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
            :disabled="isDownloading(filename)"
          >削除</el-button>
        </span>
        <span class="file-item">
          <i class="el-icon-document"></i>
          <el-button
            v-if="clickable"
            type="text"
            @click="onClick(filename)"
            :disabled="isDownloading(filename)"
          >{{filename}}</el-button>
          <span v-else >{{filename}}</span>
        </span>
      </el-row>
      <el-row v-if="downloadStatus[filename]" class="dowonload-progress">
        <download
          :status="downloadStatus[filename].status"
          :progress="downloadStatus[filename].progress"
          :message="downloadStatus[filename].message"
        ></download>
      </el-row>
    </div>
  </div>
</template>

<script>
import DownloadStatus from "./DownloadStatus";

export default {
  name: "FileList",
  components: {
    download: DownloadStatus
  },
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
    },
    downloadStatus: {
      type: Object,
      default: () => { return {}; }
    },
  },
  methods: {
    onClick(filename) {
      this.$emit("click", filename);
    },
    onDelete(filename) {
      this.$emit("input", this.value.filter(v => v !== filename));
    },
    isDownloading(filename) {
      const d = this.downloadStatus[filename];
      return d && d.status === "success" && d.progress < 100;
    }
  }
};
</script>

<style scoped>
.file-item {
  padding: 0 8px;
}
.dowonload-progress {
  line-height: 16px;
  padding: 0 0 16px 8px;
  width: 75%;
  font-size: 75%;
}
</style>