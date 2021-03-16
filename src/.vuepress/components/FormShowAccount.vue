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
      this.dialog.message = "本当にクラウド環境の削除を申請してもよろしいですか？\n\n" +
                            "申請をしたとしても、すぐにクラウド環境が削除される訳ではありません。\n" +
                            "削除の実施については、あらためて責任者の方へ確認させていただきます。";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_DELETE": {      
          this.loading = true;
          try{
            await this.$store.dispatch("reqDeleteAccount", { id: this.id });
            this.dialog.id = "INFO";
            this.dialog.cancelable = false;
            this.dialog.title = "クラウド環境の削除申請を受け付けました";
            this.dialog.message = "ただいま申請いただいた情報を確認しております。\n\n" +
                                  "クラウド環境の削除にはいくつかの注意事項があります。\n" +
                                  "また、削除の実施には責任者の同意が必要となります。\n\n" +
                                  "あらためて連絡をさせていただきますので、しばらくお待ちください。";
            this.dialog.visible = true;
          }catch(e){
            await this.$refs.notification.notify({
              status: "error",
              title: this.$page.title,
              message: e.message
            });
          }finally{
            this.loading = false;
          }
          break;
        }
        case "INFO": {
          this.$router.push({ path: "delete-account.html" });
          break;
        }
        default: break;
      }
    }
  }
}
</script>