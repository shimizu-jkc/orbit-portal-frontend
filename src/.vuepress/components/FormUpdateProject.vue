<template>
  <div id="FormUpdateProject">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClickCancel()">キャンセル</el-button>
      <el-button type="primary" :disabled="!isEdited" @click="onClickUpdate()">適用する</el-button>
    </el-row>
    <info operation="update" :id="id"/>
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
import ProjectInfo from './FormParts/ProjectInfo.vue'

export default {
  name: "FormUpdateProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: ProjectInfo
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
      return this.$store.getters.isProjectEdited(this.id);
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
          path: "show-project.html",
          query: { id: this.id }
        });
      }
    },
    async onClickUpdate() {
      this.dialog.id = "CONFIRM_UPDATE";
      this.dialog.cancelable = true;
      this.dialog.title = "更新の確認";
      this.dialog.message = "本当にプロジェクトの情報を更新してもよろしいですか？";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_CANCEL": {
          this.$router.push({
            path: "show-project.html",
            query: { id: this.id }
          });
          break;
        }
        case "CONFIRM_UPDATE": {
          this.loading = true;
          try{
            await this.$store.dispatch("reqUpdateProject", {id: this.id});
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "プロジェクト情報を更新しました。"
            });
            this.$router.push({
              path: "show-project.html",
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
  },
  created: function(){
    this.$store.commit("loadDefaultUpdateParams", this.id);
  }
}
</script>