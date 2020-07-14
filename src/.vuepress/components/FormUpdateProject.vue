<template>
  <div id="FormUpdateProject">
    <p-info operation="update"/>
    <el-row>
      <el-button @click="onClickCancel()">戻る</el-button>
      <el-button type="primary" @click="onClickUpdate()">更新する</el-button>
    </el-row>
    <loading :show="loading" message="更新中です"/>
    <notification ref="notification"/>
    <confirm
      :visible="dialog.visible" 
      :title="dialog.title"
      :message="dialog.message"
      @ok="dialog.visible=false; onEventOk()"
      @cancel="dialog.visible=false"
    />
  </div>
</template>

<script>
import Loading from './common/Loading.vue'
import Notification from './common/Notification.vue'
import Confirm from './common/Confirm.vue'
import ProjectInfo from './FormParts/ProjectInfo.vue'

export default {
  name: "FormUpdateProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    "p-info": ProjectInfo
  },
  data() {
    return {
      loading: false,
      dialog: {
        visible: false,
        title: "",
        message: ""
      }
    }
  },
  methods: {
    onClickCancel() {
      this.$router.push("/request/show-project");
    },
    onClickUpdate() {
      this.dialog.title = "更新の確認";
      this.dialog.message =  "本当にプロジェクトの情報を更新してもよろしいですか？";
      this.dialog.visible = true;
    },
    onEventOk() {
      this.dialog.visible = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$refs.notification.notify({
          status: "success",
          title: "更新の完了",
          message: "プロジェクトの情報を更新しました。"
        });
        this.$router.push("/request/show-project");
      }, 2000);
    }
  }
}
</script>