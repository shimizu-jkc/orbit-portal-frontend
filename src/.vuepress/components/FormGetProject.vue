<template>
  <div id="FormGetProject">
    <p-basic action="確認" @success="onEventSuccess($event)"/>
    <notification ref="notification"/>
  </div>
</template>

<script>
import Notification from './common/Notification.vue'
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'

export default {
  name: "FormGetProject",
  components: {
    notification: Notification,
    "p-basic": ProjectBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      this.$router.push({
        path: "show-project.html",
        query: { id: event.id }
      });
    }
  }
}
</script>