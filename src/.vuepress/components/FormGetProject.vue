<template>
  <div id="FormGetProject">
    <auth action="確認" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'

export default {
  name: "FormGetProject",
  components: {
    auth: ProjectBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      this.$router.push({
        path: "show-project.html",
        query: { id: event.projectId }
      });
    }
  }
}
</script>