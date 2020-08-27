<template>
  <div id="ProjectBasicAuth">
    <el-form label-position="top">
      <el-form-item label="プロジェクト名">
        <el-input 
          type="text"
          placeholder="プロジェクトの名称を入力してください"
          v-model="projectName"
          minlength=1
          maxlength=20
          show-word-limit
        ></el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" @click="onClickGet()">{{action}}する</el-button>
      </el-form-item>
    </el-form>
    <loading :show="loading" :message="message"/>
    <notification ref="notification"/>
  </div>
</template>

<script>
import Loading from '../common/Loading.vue'
import Notification from '../common/Notification.vue'

export default {
  name: "ProjectBasicAuth",
  components: {
    loading: Loading,
    notification: Notification
  },
  props: {
    action: {
      type: String,
      default: "確認"
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    projectName: {
      get() { return this.$store.state.c.tmp.ProjectId},
      set(value){ this.$store.commit('setTmpProjectId', value) }
    },
    message(){
      return this.action + "中です";
    }
  },
  methods: {
    async onClickGet() {
      this.loading = true;
      try{
        await this.$store.dispatch("reqGetProject", {id: this.projectName});
        this.$store.commit("setAuthProjectId", this.projectName);
        this.$emit("success", { projectId: this.projectName });
      }catch(e){
        this.$store.commit("setAuthProjectId", null);
        this.$refs.notification.notify({
          status: "error",
          title: this.$page.title,
          message: e.message
        });
        this.$emit("failed");
      }finally{
        this.loading = false;
      }
    }
  }
}
</script>