<template>
  <div id="FormShowTicket">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClickBack()">一覧に戻る</el-button>
      <el-button type="primary" @click="onClickEdit()" v-show="isShow && isEditEnabled">編集する</el-button>
      <el-button type="primary" @click="onClickClose()" v-show="isShow && isCloseEnabled">完了する</el-button>
    </el-row>
    <info operation="show" :id="id"/>
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
import Disp from "../mixins/disp";

export default {
  name: "FormShowTicket",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: TicketInfo
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
      const ticket = this.$store.getters.getTicketById(this.id);
      return ticket && (ticket.Status !== "COMPLETE" && ticket.Status !== "CLOSED");
    },
    isCloseEnabled() {
      const ticket = this.$store.getters.getTicketById(this.id);
      return ticket && (ticket.Status === "COMPLETE");
    }
  },
  methods: {
    async onClickEdit() {
      if(this.$store.getters.isExistTicketUpdateCache(this.id)) {
        this.$message.info("編集中の作業情報を復元しました。");
      } else {
        this.$store.commit("loadDefaultTicketUpdateParams", this.id);
      }
      this.$router.push({
        path: "update-ticket.html",
        query: { id: this.id }
      });
    },
    async onClickBack() {
      this.$router.push({
        path: "show-tickets.html"
      });
    },
    async onClickClose() {
      this.dialog.id = "CONFIRM_CLOSE";
      this.dialog.cancelable = true;
      this.dialog.title = "完了の確認";
      this.dialog.message = "作業を完了してもよろしいですか？";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_CLOSE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqCloseTicket", {id: this.id});
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "作業を完了しました。"
            });
          }catch(e){
            console.log(e);
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
        default: break;
      }
    }
  }
}
</script>