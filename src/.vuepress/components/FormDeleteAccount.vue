<template>
  <div id="FormDeleteAccount">
    <auth action="認証" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import AccountBasicAuth from './FormParts/AccountBasicAuth.vue'

export default {
  name: "FormDeleteAccount",
  components: {
    auth: AccountBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      this.$router.push({
        path: "show-account.html",
        query: { id: event.accountId, operation: "delete" }
      });
    }
  }
}
</script>