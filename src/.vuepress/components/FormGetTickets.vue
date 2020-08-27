<template>
  <div id="FormGetTickets">
    <a-basic action="確認" @success="onEventSuccess($event)"/>
    <notification ref="notification"/>
  </div>
</template>

<script>
import Notification from './common/Notification.vue'
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'

export default {
  name: "FormGetTickets",
  components: {
    notification: Notification,
    "a-basic": AccountBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      try{
        await this.$store.dispatch("reqGetTickets", {projectId: event.projectId, accountId: event.accountId});
        this.$router.push({
          path: "show-tickets.html"
        });
      }catch(e){
        this.$refs.notification.notify({
          status: "error",
          title: this.$page.title,
          message: e.message
        });
      }
    }
  }
}
</script>