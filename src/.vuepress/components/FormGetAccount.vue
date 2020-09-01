<template>
  <div id="FormGetAccount">
    <auth action="確認" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'

export default {
  name: "FormGetAccount",
  components: {
    auth: AccountBasicAuth
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