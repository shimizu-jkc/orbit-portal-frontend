<template>
  <div id="FormGetProject">
    <p-basic action="確認" @success="onEventSuccess()"/>
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
    onEventSuccess() {
      this.$store.dispatch("getProject");
      this.$router.push("/request/show-project");
    }
  }
}
</script>