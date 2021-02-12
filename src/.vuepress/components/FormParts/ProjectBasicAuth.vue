<template>
  <div id="ProjectBasicAuth">
    <el-form label-position="top" @submit.native.prevent>
      <el-form-item label="プロジェクト名">
        <el-input 
          type="text"
          placeholder="プロジェクトの名称を入力してください"
          v-model="projectId"
          minlength=1
          maxlength=20
          show-word-limit
          @keypress.enter.native="isValid && onClickGet()"
        ></el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" :disabled="!isValid" @click="onClickGet()">{{action}}する</el-button>
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
    projectId: {
      get() { return this.$store.state.c.tmp.ProjectId },
      set(value){ this.$store.commit('setTmpProjectId', value) }
    },
    message(){
      return this.action + "中です";
    },
    isValid(){
      return this.projectId !== "";
    }
  },
  methods: {
    async onClickGet() {
      this.loading = true;
      try{
        const lastAuthProjectId = this.$store.getters.lastAuthProjectId();
        const needAuth = this.$store.getters.needProjectAuth(); 
        if(needAuth){
          await this.$store.dispatch("reqGetProject", {id: this.projectId});
          this.$store.commit("setAuthProjectId", this.projectId);
        }
        if(this.projectId !== lastAuthProjectId){
          // disable account create cache
          this.$store.commit("clearAccountCreateParams");
        }
        this.$emit("success", { projectId: this.projectId, changed: needAuth });
      }catch(e){
        //this.$store.commit("clearProjectCache");
        await this.$refs.notification.notify({
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