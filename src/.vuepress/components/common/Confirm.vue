<template>
  <div id="Confirm">
    <el-form>
      <el-form-item>
        <el-dialog :title="title" :visible.sync="visible" width="30%">
          <span>{{message}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="onClick(false)">キャンセル</el-button>
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
    visible: {
      type: Boolean,
      default: false
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
      this.$emit(ok ? "ok": "cancel");
    }
  }
}
</script>