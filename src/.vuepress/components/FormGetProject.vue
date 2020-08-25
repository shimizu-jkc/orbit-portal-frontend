<template>
  <div id="FormGetProject">
    <p-basic action="確認" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'

export default {
  name: "FormGetProject",
  components: {
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