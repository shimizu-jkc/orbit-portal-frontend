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
      <p-info operation="create" />
      <el-form-item>
        <el-button type="primary" @click="onClickCreate()">登録する</el-button>
      </el-form-item>
    </el-form>
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
    "p-info": ProjectInfo
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
    onClickCreate() {
      if(!this.agreements.every(a => {return a})){
        this.dialog.id = "ALERT";
        this.dialog.cancelable = false;
        this.dialog.title = "登録の警告";
        this.dialog.message = "「登録する前の確認」がチェックされていません。";
        this.dialog.visible = true;
      }else{
        this.dialog.id = "CONFIRM_CREATE";
        this.dialog.cancelable = true;
        this.dialog.title = "登録の確認";
        this.dialog.message = "プロジェクトを登録します。よろしいですか？";
        this.dialog.visible = true;
      }
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_CREATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqCreateProject");
            this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "プロジェクトを登録しました。"
            });
            this.$router.push({
              path: "show-project.html",
              query: { id: this.$store.state.p.createParams.ProjectId }
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