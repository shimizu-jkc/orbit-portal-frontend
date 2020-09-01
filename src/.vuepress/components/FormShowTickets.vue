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
  }
}
</script>