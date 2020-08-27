<template>
  <div id="FormDeleteProject">
    <div id="preAuth" v-if="!completeAuth">
      <p-basic action="認証" @success="onEventSuccess($event)"/>
    </div>
    <div id="postAuth" v-else>
      <el-row type="flex" justify="end">
        <el-button @click="completeAuth=false">キャンセル</el-button>
        <el-button type="danger" @click="onClickDelete()">解除する</el-button>
      </el-row>
      <p-info operation="delete" :id="id" />
    </div>
    <loading :show="loading" message="解除中です"/>
    <notification ref="notification"/>
    <confirm
      :id="dialog.id"
      :title="dialog.title"
      :message="dialog.message"
      :visible="dialog.visible" 
      :cancelable="dialog.cancelable"
      @ok="dialog.visible=false; onEventOk($event)"
      @cancel="dialog.visible=false"
    />
  </div>
</template>

<script>
import Loading from './common/Loading.vue'
import Notification from './common/Notification.vue'
import Confirm from './common/Confirm.vue'
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'
import ProjectInfo from './FormParts/ProjectInfo.vue'

export default {
  name: "FormDeleteProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    "p-basic": ProjectBasicAuth,
    "p-info": ProjectInfo
  },
  data() {
    return {
      loading: false,
      dialog: {
        id: "",
        visible: false,
        cancelable: true,
        title: "",
        message: ""
      },
      completeAuth: false,
      id: ""
    }
  },
  methods: {
    onEventSuccess(event) {
      this.id = event.projectId;
      this.completeAuth = true;
    },
    onClickDelete() {
      this.dialog.id = "CONFIRM_DELETE";
      this.dialog.cancelable = true;
      this.dialog.title = "登録解除の確認";
      this.dialog.message ="本当にプロジェクトの登録を解除してもよろしいですか？";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_DELETE": {      
          this.loading = true;
          try{
            await this.$store.dispatch("reqDeleteProject", { id: this.id });
            this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "プロジェクトの登録を解除しました。"
            });
            this.$router.push({
              path: "goodbye.html"
            });
          }catch(e){
            this.$refs.notification.notify({
              status: "error",
              title: this.$page.title,
              message: e.message
            });
          }finally{
            this.loading = false;
          }
        }
        default: break;
      }
    }
  }
}
</script>