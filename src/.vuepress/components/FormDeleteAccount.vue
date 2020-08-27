<template>
  <div id="FormDeleteAccount">
    <div id="preAuth" v-if="!completeAuth">
      <a-basic action="認証" @success="onEventSuccess($event)"/>
    </div>
    <div id="postAuth" v-else>
      <el-row type="flex" justify="end">
        <el-button @click="completeAuth=false">キャンセル</el-button>
        <el-button type="danger" @click="onClickDelete()">削除する</el-button>
      </el-row>
      <a-info operation="delete" :id="id" />
    </div>
    <loading :show="loading" message="削除の申請中です"/>
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
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'
import AccountInfo from './FormParts/AccountInfo.vue'

export default {
  name: "FormDeleteAccount",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    "a-basic": AccountBasicAuth,
    "a-info": AccountInfo
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
      this.id = event.accountId;
      this.completeAuth = true;
    },
    onClickDelete() {
      this.dialog.id = "CONFIRM_DELETE";
      this.dialog.cancelable = true;
      this.dialog.title = "削除申請の確認";
      this.dialog.message ="本当にクラウド環境の削除を申請してもよろしいですか？";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_DELETE": {      
          this.loading = true;
          try{
            await this.$store.dispatch("reqDeleteAccount", { id: this.id });
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "クラウド環境の削除を申請しました。"
            });
            this.$refs.notification.notify({
              status: "info",
              title: "申請における注意事項",
              message: "クラウド環境を本当に削除するの確認を、プロジェクト代表者へ連絡しますので、しばらくの間お待ちください。"
            });
            this.$router.push({
              path: "get-account.html"
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