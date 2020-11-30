<template>
  <div id="FormShowTicket">
    <el-row type="flex" justify="end">
      <el-button type="primary" plain @click="onClickBack()">一覧に戻る</el-button>
      <el-button type="primary" @click="onClickEdit()" v-show="isShow">編集する</el-button>
    </el-row>
    <info operation="show" :id="id"/>
  </div>
</template>

<script>
import TicketInfo from './FormParts/TicketInfo.vue'
import Disp from "../mixins/disp";

export default {
  name: "FormShowTicket",
  components: {
    info: TicketInfo
  },
  mixins: [Disp],
  data() {
    return {
      id: this.$route.query.id,
      operation: this.$route.query.operation || "show"
    };
  },
  methods: {
    async onClickEdit() {
      this.$store.commit("loadDefaultTicketUpdateParams", this.id);
      this.$router.push({
        path: "update-ticket.html",
        query: { id: this.id }
      });
    },
    async onClickBack() {
      this.$router.push({
        path: "show-tickets.html"
      });
    }
  }
}
</script>