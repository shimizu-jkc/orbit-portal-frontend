<template>
  <div id="FormShowTickets">
    <t-list/>
  </div>
</template>

<script>
import TicketList from './FormParts/TicketList.vue'
  
export default {
  name: "FormShowTickets",
  components: {
    "t-list": TicketList
  }
}
</script>