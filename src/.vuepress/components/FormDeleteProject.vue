<template>
  <div id="FormDeleteProject">
    <p-info operation="delete"/>
    <el-row>
      <el-button type="primary" @click="onClickDelete()">解除する</el-button>
    </el-row>
    <loading :show="loading" message="解除中です"/>
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
  name: "FormDeleteProject",
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
    onClickDelete() {
      this.dialog.title = "登録解除の確認";
      this.dialog.message = "本当にプロジェクトの登録を解除してもよろしいですか？";
      this.dialog.visible = true;
    },
    onEventOk() {
      this.dialog.visible = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$refs.notification.notify({
          status: "success",
          title: "登録解除の完了",
          message: "プロジェクトの登録を解除しました。"
        });
        this.$router.push('/request/goodbye');
      }, 2000);
    }
  }
}
</script>