<template>
  <div id="ExternalApiSpec">
    <iframe class="api-inline" :src="url"></iframe>
  </div>
</template>

<script>
export default {
  name: "ExternalApiSpec",
  props: ["url"]
}
</script>
<style scoped>
.api-inline {
  width: 100%;
  height: 1500px;
}
</style>