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
        case "success": {
          this.$notify({
            title: prop.title || this.title,
            message: prop.message || this.message, 
            type: "success",
            duration: 5000
          });
          break;
        }
        case "warning": {
          this.$notify({
            title: prop.title || this.title,
            message: prop.message || this.message, 
            type: "warning",
            duration: 0
          });
          break;
        }
        case "error": {
          this.$notify.error({
            title: prop.title || this.title,
            message: prop.message || this.message,
            duration: 0
          });
          break;
        }
        case "info": {
          this.$notify.info({
            title: prop.title || this.title,
            message: prop.message || this.message,
            duration: 10000
          });
          break;
        }
        default: break;
      }
    }
  }
}
</script>