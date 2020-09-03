<template>
  <div id="FormGetTickets">
    <auth action="確認" @success="onEventSuccess($event)"/>
    <loading :show="loading" message="作業一覧の取得中です"/>
    <notification ref="notification"/>
  </div>
</template>

<script>
import Loading from './common/Loading.vue'
import Notification from './common/Notification.vue'
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'

export default {
  name: "FormGetTickets",
  components: {
    loading: Loading,
    notification: Notification,
    auth: AccountBasicAuth
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async onEventSuccess(event) {
      try{
        if(event.changed || this.$store.getters.getTicketList().length === 0){
          this.loading = true;
          await this.$store.dispatch("reqGetTickets", { projectId: event.projectId, accountId: event.accountId });
        }
        this.$router.push({ path: "show-tickets.html" });
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
  }
}
</script>