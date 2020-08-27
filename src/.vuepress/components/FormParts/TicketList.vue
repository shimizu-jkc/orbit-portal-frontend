<template>
  <div id="TicketList">
    <el-table :data="tickets">
      <el-table-column sortable prop="TicketId" label="作業ID"></el-table-column>
      <el-table-column sortable prop="TicketEmail" label="連絡先Eメールアドレス"></el-table-column>
      <el-table-column sortable prop="Type" label="作業種別" :formatter="typeFormatter"></el-table-column>
      <el-table-column sortable prop="Status" label="作業状況" :formatter="statusFormatter"></el-table-column>
      <el-table-column sortable prop="CreatedAt" label="作業依頼日" :formatter="epochFormatter" width="160"></el-table-column>
      <el-table-column sortable prop="UpdatedAt" label="最終更新日" :formatter="epochFormatter" width="160"></el-table-column>
      <el-table-column width="80">
        <template v-slot="scope">
          <el-button type="primary" @click="onClickDetail(scope.row)" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";

export default {
  name: "TicketList",
  components: {},
  mixins: [Util, Disp],
  data() {
    return {
      projectId: this.$store.state.c.auth.ProjectId,
      accountId: this.$store.state.c.auth.AccountId
    };
  },
  computed: {
    tickets() { return this.$store.state.t.results; }
  },
  methods: {
    async onClickDetail(ticket){
      try{
        await this.$store.dispatch("reqGetTicket", {
          id: ticket.TicketId,
          projectId: ticket.OwnerProjectId,
          accountId: ticket.OwnerAccountId
        });
        this.$router.push({
          path: "show-ticket.html",
          query: { id: ticket.TicketId },
        });
      }catch(e){
        console.error(e);
      }finally{
      }
    },
    typeFormatter(row, column, value) {
      return this.getDispName("TicketType", value)
    },
    statusFormatter(row, column, value) {
      return this.getDispName("TicketStatus", value)
    },
    epochFormatter(row, column, value) {
      return this.epochSecToJST(value);
    }
  }
};
</script>

<style>
table {
  margin: 0
}
.el-table th{
  background-color: #EEEEEE;
}
.el-table tr{
  background-color: #FFFFFF;
}
.el-row {
  margin: 12px 0;
}
</style>