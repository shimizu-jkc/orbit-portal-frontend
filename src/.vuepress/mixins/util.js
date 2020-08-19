// Common utility mixin

export default {
  methods: {
    epochSecToJST(epoch) {
      return new Date(epoch * 1000).toLocaleString("ja", {
        timeZone: "Asia/Tokyo"
      });
    }
  }
}
