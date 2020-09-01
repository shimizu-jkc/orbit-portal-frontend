<template>
  <div id="FormDeleteProject">
    <auth action="認証" @success="onEventSuccess($event)"/>
  </div>
</template>

<script>
import ProjectBasicAuth from './FormParts/ProjectBasicAuth.vue'

export default {
  name: "FormDeleteProject",
  components: {
    auth: ProjectBasicAuth
  },
  methods: {
    async onEventSuccess(event) {
      this.$router.push({
        path: "show-project.html",
        query: { id: event.projectId, operation: "delete" }
      });
    }
  }
}
</script>