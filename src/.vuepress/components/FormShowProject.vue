<template>
  <div id="FormShowProject">
    <el-row type="flex" justify="end">
      <el-button type="danger" @click="onClickDelete()" v-show="isDelete">解除する</el-button>
      <el-button type="primary" @click="onClickEdit()" v-show="isShow">編集する</el-button>
    </el-row>
    <info operation="show" :id="id"/>
    <loading :show="loading" message="解除中です"/>
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
import Disp from "../mixins/disp";

export default {
  name: "FormShowProject",
  components: {
    loading: Loading,
    confirm: Confirm,
    notification: Notification,
    info: ProjectInfo
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
  methods: {
    async onClickEdit() {
      if(this.$store.getters.isExistProjectUpdateCache(this.id)) {
        this.$message.info("編集中のプロジェクト情報を復元しました。");
      } else {
        this.$store.commit("loadDefaultUpdateParams", this.id);
      }
      this.$router.push({
        path: "update-project.html",
        query: { id: this.id }
      });
    },
    async onClickDelete() {
      this.dialog.id = "CONFIRM_DELETE";
      this.dialog.cancelable = true;
      this.dialog.title = "登録解除の確認";
      this.dialog.message ="本当にプロジェクトの登録を解除してもよろしいですか？";
      this.dialog.visible = true;
    },
    async onEventOk(event) {
      switch(event.id){
        case "CONFIRM_DELETE": {      
          this.loading = true;
          try{
            await this.$store.dispatch("reqDeleteProject", { id: this.id });
            await this.$refs.notification.notify({
              status: "success",
              title: this.$page.title,
              message: "プロジェクトの登録を解除しました。"
            });
            this.$router.push({ path: "goodbye.html" });
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