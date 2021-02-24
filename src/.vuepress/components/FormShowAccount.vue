<template>
  <div id="FormShowAccount">
    <el-row type="flex" justify="end">
      <el-button type="danger" :disabled="!isDeleteEnabled" @click="onClickDelete()" v-show="isDelete">削除する</el-button>
      <el-button type="primary" @click="onClickEdit()" v-show="isShow && isEditEnabled">編集する</el-button>
    </el-row>
    <info operation="show" :id="id"/>
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
import AccountInfo from './FormParts/AccountInfo.vue'
import Disp from "../mixins/disp";
  
export default {
  name: "FormShowAccount",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: AccountInfo
  },
  mixins: [Disp],
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
      id: this.$route.query.id,
      operation: this.$route.query.operation || "show"
    };
  },
  computed: {
    isEditEnabled() {
      const account = this.$store.getters.getAccountById(this.id);
      return account && (account.Status === "WAITING_CONFIRM" || account.Status === "REJECT" || account.Status === "AVAILABLE");
    },
    isDeleteEnabled() {
      const account = this.$store.getters.getAccountById(this.id);
      return account && !(account.Status === "WAITING_DELETE" || account.Status === "DELETE_START" || account.Status === "DELETE_COMPLETED");
    }
  },
  methods: {
    async onClickEdit() {
      if(this.$store.getters.isExistAccountUpdateCache(this.id)) {
        this.$message.info("編集中のクラウド環境情報を復元しました。");
      } else {
        this.$store.commit("loadDefaultAccountUpdateParams", this.id);
      }
      this.$router.push({
        path: "update-account.html",
        query: { id: this.id }
      });
    },
    async onClickDelete() {
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
            await this.$refs.notification.notify({
              status: "info",
              title: "申請における注意事項",
              message: "クラウド環境の削除について、クラウド環境責任者へ確認します。\n削除までしばらくお待ちください。"
            });
            this.$router.push({ path: "get-account.html" });
          }catch(e){
            await this.$refs.notification.notify({
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