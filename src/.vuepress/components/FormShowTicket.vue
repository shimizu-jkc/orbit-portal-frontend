<template>
  <div id="FormShowTicket">
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="onClickEdit()">編集する</el-button>
      <el-button type="primary" plain @click="onClickBack()">一覧に戻る</el-button>
    </el-row>
    <t-info operation="show" :id="id"/>
  </div>
</template>

<script>
import TicketInfo from './FormParts/TicketInfo.vue'
  
export default {
  name: "FormShowTicket",
  components: {
    "t-info": TicketInfo
  },
  data() {
    return {
      id: this.$route.query.id,
    };
  },
  methods: {
    onClickEdit() {
      this.$router.push({
        path: "update-ticket.html",
        query: { id: this.id }
      });
    },
    onClickBack() {
      this.$router.push({
        path: "show-tickets.html"
      });
    }
  }
}
</script>