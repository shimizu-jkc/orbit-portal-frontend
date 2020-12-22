<template>
  <div id="FormCreateAccount">
    <div id="preAuth" v-if="!completeAuth">
      <auth action="認証" @success="onEventSuccess($event)"/>
    </div>
    <div id="postAuth" v-else>
      <el-form>
        <el-form-item label="申請する前の確認" required>
          <el-col>
            <el-checkbox 
              label="申請者には「プロジェクト管理者」の権限が付与されている必要があります。" 
              v-model="agreements[0]"
            ></el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox 
              label="クラウド環境を利用する為には、審査があります。" 
              v-model="agreements[1]"
            ></el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox 
              label="クラウド環境が利用可能になるまで、最大5営業日程度掛かることがあります。" 
              v-model="agreements[2]"
            ></el-checkbox>
          </el-col>
        </el-form-item>
      </el-form>
      <info ref="info" operation="create" id=""/>
      <el-row type="flex" justify="start">
        <el-button type="primary" @click="onClickCreate()">申請する</el-button>
      </el-row>
    </div>
    <loading :show="loading" message="申請中です"/>
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
import AccountInfo from './FormParts/AccountInfo.vue'
  
export default {
  name: "FormCreateAccount",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    auth: ProjectBasicAuth,
    info: AccountInfo
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
      agreements: [false, false, false],
      completeAuth: false,
    }
  },
  computed: {
    projectId(){ return this.$store.state.c.auth.ProjectId; }, 
  },
  methods: {
    async onEventSuccess(event) {
      this.completeAuth = true;
    },
    async onClickCreate() {
      const showAlertDialog = (message) => {
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "申請の警告";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      const showConfirmDialog = (message) => {
        this.dialog.id = "CONFIRM_CREATE";
        this.dialog.cancelable = true;
        this.dialog.title = "申請の確認";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      if(!this.agreements.every(a => {return a})){
        showAlertDialog("「申請する前の確認」がチェックされていません。");
        return;
      }
      try{
        // validation check
        await this.$refs["info"].validate();
      }catch(err){
        showAlertDialog(err.message);
        return;
      }
      showConfirmDialog("クラウド環境の利用を申請します。よろしいですか？");
    },
    async onEventOk(event) {
        switch(event.id){
        case "CONFIRM_CREATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqCreateAccount", {projectId: this.projectId});
            this.$store.commit("clearAccountCreateParams");
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "クラウド環境の利用を申請しました。"
            });
            await this.$refs.notification.notify({
              status: "info",
              title: "申請における注意事項",
              message: "クラウド環境が利用できるまで、最大5営業日程度掛かる場合があります。\n利用可能になった際にはプロジェクトの代表者へ連絡しますので、しばらくの間お待ちください。"
            });
            this.$router.push({
              path: "show-account.html",
              query: { id: this.$store.getters.getAccountResult().AccountId, operation: "create" }
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