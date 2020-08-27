<template>
  <div id="FormCreateTicket">
    <el-form>
      <el-form-item label="依頼する前の確認">
        <el-col>
          <el-checkbox 
            label="作業の実施には、最大5営業日程度掛かることがあります。" 
            v-model="agreements[0]"
          ></el-checkbox>
        </el-col>
      </el-form-item>
      <div id="preAuth" v-if="!completeAuth">
        <a-basic action="認証" @success="onEventSuccess($event)"/>
      </div>
      <div id="postAuth" v-else>
        <t-info operation="create" id=""/>
        <el-form-item>
          <el-button type="primary" @click="onClickCreate()">依頼する</el-button>
        </el-form-item>
      </div>
    </el-form>
    <loading :show="loading" message="依頼中です"/>
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
    "a-basic": AccountBasicAuth,
    "t-info": TicketInfo
  },
  data(){
    return {
      loading: false,
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
    onEventSuccess(event) {
      this.completeAuth = true;
    },
    onClickCreate() {
      if(!this.agreements.every(a => {return a})){
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "依頼の警告";
        this.dialog.message = "「依頼する前の確認」がチェックされていません。";
        this.dialog.visible = true;
      }else{
        this.dialog.id = "CONFIRM_CREATE";
        this.dialog.cancelable = true;
        this.dialog.title = "依頼の確認";
        this.dialog.message = "管理者へ作業を依頼します。よろしいですか？";
        this.dialog.visible = true;
      }
    },
    async onEventOk(event) {
        switch(event.id){
        case "CONFIRM_CREATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqCreateTicket", {projectId: this.projectId, accountId: this.accountId});
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "管理者へ作業を依頼しました。"
            });
            this.$router.push({
              path: "show-ticket.html",
              query: { id: this.$store.getters.getTicketResult().TicketId }
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
        case "ALERT":
        default: break;
      }
    }
  }
}
</script>