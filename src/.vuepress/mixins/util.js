// Common utility mixin
export default {
  methods: {
    epochSecToJST(epoch) {
      return new Date(epoch * 1000).toLocaleString("ja", {
        timeZone: "Asia/Tokyo"
      });
    },
    DateToEpochSec(date) {
      return (date ? (Math.floor(date.getTime()/1000)) : 0);
    },
    getEmailPattern() {
      return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    }
  }
}
