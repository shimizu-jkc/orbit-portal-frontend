<template>
  <div id="FormUpdateTicket">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClickCancel()">キャンセル</el-button>
      <el-button type="primary" :disabled="!isEdited" @click="onClickUpdate()">適用する</el-button>
    </el-row>
    <info ref="info" operation="update" :id="id"/>
    <loading :show="loading" message="更新中です"/>
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
import TicketInfo from './FormParts/TicketInfo.vue'

export default {
  name: "FormUpdateTicket",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: TicketInfo
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
      id: this.$route.query.id,
    }
  },
  computed: {
    isEdited() {
      return this.$store.getters.isTicketEdited(this.id);
    }
  },
  methods: {
    async onClickCancel() {
      if(this.isEdited){
        this.dialog.id = "CONFIRM_CANCEL";
        this.dialog.cancelable = true;
        this.dialog.title = "更新のキャンセル";
        this.dialog.message = "編集中の内容は失われますがよろしいですか？";
        this.dialog.visible = true;
      }else{
        this.$router.push({
          path: "show-ticket.html",
          query: { id: this.id }
        });
      }
    },
    async onClickUpdate() {
      const showAlertDialog = (message) => {
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "更新の警告";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      const showConfirmDialog = (message) => {
        this.dialog.id = "CONFIRM_UPDATE";
        this.dialog.cancelable = true;
        this.dialog.title = "更新の確認";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      try{
        // validation check
        await this.$refs["info"].validate();
      }catch(err){
        showAlertDialog(err.message);
        return;
      }
      showConfirmDialog("本当に作業内容を更新してもよろしいですか？");
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_CANCEL": {
          this.$router.push({
            path: "show-ticket.html",
            query: { id: this.id }
          });
          break;
        }
        case "CONFIRM_UPDATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqUpdateTicket", {id: this.id});
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "作業内容を更新しました。"
            });
            this.$router.push({
              path: "show-ticket.html",
              query: { id: this.id }
            });
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
        case "ALERT":
        default: break;
      }
    }
  }
}
</script>