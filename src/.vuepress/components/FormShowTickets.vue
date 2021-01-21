<template>
  <div id="FormShowTickets">
    <list/>
  </div>
</template>

<script>
import TicketList from './FormParts/TicketList.vue'
  
export default {
  name: "FormShowTickets",
  components: {
    list: TicketList
  },
  created(){
    // check auth for reload
    const needProjectAuth = this.$store.getters.needProjectAuth();
    const needAccountAuth = this.$store.getters.needAccountAuth();
    if(needProjectAuth || needAccountAuth) {
      this.$router.push({ path: "get-tickets.html" });
    }
  }
}
</script>