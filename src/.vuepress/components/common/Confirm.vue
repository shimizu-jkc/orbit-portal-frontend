<template>
  <div id="Confirm">
    <el-form>
      <el-form-item>
        <el-dialog 
          width="30%"
          :title="title" 
          :visible.sync="visible" 
          :show-close="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
        >
          <span>{{message}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button v-show="cancelable" @click="onClick(false)">キャンセル</el-button>
            <el-button type="primary" @click="onClick(true)">OK</el-button>
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Confirm",
  props: {
    id: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    cancelable: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "確認"
    },
    message: {
      type: String,
      default: "本当によろしいですか？"
    }
  },
  methods: {
    onClick(ok){
      this.$emit(ok ? "ok": "cancel", { id: this.id });
    }
  }
}
</script>