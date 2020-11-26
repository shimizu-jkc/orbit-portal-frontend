<template>
  <div id="AccountBasicAuth">
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
      <el-form-item label="クラウド環境ID">
        <el-input 
          type="text"
          placeholder="クラウド環境のIDを入力してください"
          v-model="accountId"
          minlength=12
          maxlength=12
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
  name: "AccountBasicAuth",
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
      get() { return this.$store.state.c.tmp.ProjectId},
      set(value){ this.$store.commit('setTmpProjectId', value) }
    },
    accountId: {
      get() { return this.$store.state.c.tmp.AccountId},
      set(value){ this.$store.commit('setTmpAccountId', value) }
    },
    message(){
      return this.action + "中です";
    },
    isValid(){
      return !!this.projectId && !!this.accountId;
    }
  },
  methods: {
    async onClickGet() {
      this.loading = true;
      try{
        const needProjectAuth = this.$store.getters.needProjectAuth(); 
        if(needProjectAuth){
          await this.$store.dispatch("reqGetProject", {id: this.projectId});
          this.$store.commit("setAuthProjectId", this.projectId);
        }
        const needAccountAuth = this.$store.getters.needAccountAuth(); 
        if(needAccountAuth){
          await this.$store.dispatch("reqGetAccount", {id: this.accountId, projectId: this.projectId});
          this.$store.commit('setAuthAccountId', this.accountId);
        }
        this.$emit("success", { 
          projectId: this.projectId, 
          accountId: this.accountId,
          changed: (needProjectAuth | needAccountAuth)
        });
      }catch(e){
        //this.$store.commit("clearProjectCache");
        //this.$store.commit("clearAccountCache");
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