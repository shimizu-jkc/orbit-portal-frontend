<template>
  <div id="Notification">
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      status: "success",
      title: "処理完了",
      message: "処理が完了しました。"
    };
  },
  methods: {
    notify(prop){
      switch(prop.status){
        case "success":
        case "warning": {
          this.$notify({
            title: prop.title || this.title,
            message: prop.message || this.message, 
            type: prop.status || this.status
          });
          break;
        }
        case "error": {
          this.$notify.error({
            title: prop.title || this.title,
            message: prop.message || this.message
          });
          break;
        }
        case "info": {
          this.$notify.info({
            title: prop.title || this.title,
            message: prop.message || this.message
          });
          break;
        }
        default: break;
      }
    }
  }
}
</script>