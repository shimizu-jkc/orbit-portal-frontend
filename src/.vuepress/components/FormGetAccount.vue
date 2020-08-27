<template>
  <div id="FormGetAccount">
    <a-basic action="確認" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'

export default {
  name: "FormGetAccount",
  components: {
    "a-basic": AccountBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      this.$router.push({
        path: "show-account.html",
        query: { id: event.accountId }
      });
    }
  }
}
</script>