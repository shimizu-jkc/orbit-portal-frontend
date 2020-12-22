<template>
  <div id="FormCreateTicket">
    <div id="preAuth" v-if="!completeAuth">
      <auth action="認証" @success="onEventSuccess($event)"/>
    </div>
    <div id="postAuth" v-else>
      <el-form>
        <el-form-item label="依頼する前の確認" required>
          <el-col>
            <el-checkbox 
              label="作業の実施には、最大5営業日程度掛かることがあります。" 
              v-model="agreements[0]"
            ></el-checkbox>
          </el-col>
        </el-form-item>
      </el-form>
      <info ref="info" operation="create" id=""/>
      <el-row type="flex" justify="start">
        <el-button type="primary" @click="onClickCreate()">依頼する</el-button>
      </el-row>
    </div>
    <loading :show="loading.show" :message="loading.message"/>
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
import TicketInfo from './FormParts/TicketInfo.vue'
  
export default {
  name: "FormCreateTicket",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    auth: AccountBasicAuth,
    info: TicketInfo
  },
  data(){
    return {
      loading: {
        show: false,
        message: ""
      },
      dialog: {
        id: "",
        visible: false,
        cancelable: true,
        title: "",
        message: ""
      },
      agreements: [false],
      completeAuth: false,
    }
  },
  computed: {
    projectId(){ return this.$store.state.c.auth.ProjectId; }, 
    accountId(){ return this.$store.state.c.auth.AccountId; } 
  },
  methods: {
    async onEventSuccess(event) {
      try{
        if(event.changed || this.$store.getters.getTicketList().length === 0){
          this.loading.message = "処理中です";
          this.loading.show = true;
          await this.$store.dispatch("reqGetTickets", { projectId: event.projectId, accountId: event.accountId });
        }
        this.completeAuth = true;
      }catch(e){
        await this.$refs.notification.notify({
          status: "error",
          title: this.$page.title,
          message: e.message
        });        
      }finally{
        this.loading.show = false;
      }
    },
    async onClickCreate() {
      const showAlertDialog = (message) => {
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "依頼の警告";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      const showConfirmDialog = (message) => {
        this.dialog.id = "CONFIRM_CREATE";
        this.dialog.cancelable = true;
        this.dialog.title = "依頼の確認";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      if(!this.agreements.every(a => {return a})){
        showAlertDialog("「依頼する前の確認」がチェックされていません。");
        return;
      }
      try{
        // validation check
        await this.$refs["info"].validate();
      }catch(err){
        showAlertDialog(err.message);
        return;
      }
      showConfirmDialog("管理者へ作業を依頼します。よろしいですか？");
    },
    async onEventOk(event) {
        switch(event.id){
        case "CONFIRM_CREATE": {
          this.loading.message = "作業の依頼中です";
          this.loading.show = true;
          try{
            await this.$store.dispatch("reqCreateTicket", {projectId: this.projectId, accountId: this.accountId});
            this.$store.commit("clearTicketCreateParams");
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "管理者へ作業を依頼しました。"
            });
            this.$router.push({
              path: "show-ticket.html",
              query: { id: this.$store.getters.getTicketResult().TicketId, operation: "create" }
            });
          }catch(e){
            await this.$refs.notification.notify({
              status: "error",
              title: this.$page.title,
              message: e.message
            });
          }finally{
            this.loading.show = false;
          }
        }
        case "ALERT":
        default: break;
      }
    }
  }
}
</script>