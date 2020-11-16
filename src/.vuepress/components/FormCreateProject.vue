<template>
  <div id="FormCreateProject">
    <el-form>
      <el-form-item label="登録する前の確認">
        <el-col>
          <el-checkbox 
            label="プロジェクトとしての体制が構築されている。" 
            v-model="agreements[0]"
          ></el-checkbox>
        </el-col>
        <el-col>
          <el-checkbox 
            label="クラウド利用料金の配賦先が明確になっている。" 
            v-model="agreements[1]"
          ></el-checkbox>
        </el-col>
      </el-form-item>
    </el-form>
    <info operation="create" />
    <el-row type="flex" justify="start">
      <el-button type="primary" @click="onClickCreate()">登録する</el-button>
    </el-row>
    <loading :show="loading" message="登録中です"/>
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
import ProjectInfo from './FormParts/ProjectInfo.vue'
  
export default {
  name: "FormCreateProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: ProjectInfo
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
      agreements: [false, false]
    }
  },
  methods: {
    async onClickCreate() {
      const showAlertDialog = (message) => {
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "登録の警告";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      const showConfirmDialog = (message) => {
        this.dialog.id = "CONFIRM_CREATE";
        this.dialog.cancelable = false;
        this.dialog.title = "登録の確認";
        this.dialog.message = message;
        this.dialog.visible = true;
      };
      if(!this.agreements.every(a => {return a})){
        showAlertDialog("「登録する前の確認」がチェックされていません。");
        return;
      }
      if(!this.$store.state.p.createParams.Members.length){
        showAlertDialog("メンバーを登録してください。");
        return;
      }
      if(!this.$store.state.p.createParams.Members.some(m => m.Admin)){
        showAlertDialog("少なくとも1人の管理者が必要です。");
        return;
      }
      showConfirmDialog("プロジェクトを登録します。よろしいですか？");
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_CREATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqCreateProject");
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "プロジェクトを登録しました。"
            });
            this.$router.push({
              path: "show-project.html",
              query: { id: this.$store.getters.getProjectResult().ProjectId, operation: "create" }
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