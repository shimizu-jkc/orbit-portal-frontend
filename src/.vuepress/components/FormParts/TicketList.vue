<template>
  <div id="TicketList">
    <el-row>
      <el-col :span="4"><span>プロジェクト名</span></el-col>
      <el-col :span="6"><span>{{projectId}}</span></el-col>
      <el-col :span="4"><span>クラウド環境ID</span></el-col>
      <el-col :span="6"><span>{{accountId}}</span></el-col>
    </el-row>
    <el-table :data="tickets":default-sort="defaultSort">
      <el-table-column sortable prop="TicketId" label="作業ID"></el-table-column>
      <el-table-column sortable prop="TicketEmail" label="連絡先Eメールアドレス"></el-table-column>
      <el-table-column sortable prop="Type" label="作業種別" :formatter="typeFormatter"></el-table-column>
      <el-table-column sortable prop="Status" label="ステータス" :formatter="statusFormatter"></el-table-column>
      <el-table-column sortable prop="CreatedAt" label="登録日" :formatter="epochFormatter" width="160"></el-table-column>
      <el-table-column sortable prop="UpdatedAt" label="最終更新日" :formatter="epochFormatter" width="160"></el-table-column>
      <el-table-column width="80">
        <template v-slot="scope">
          <el-button type="primary" @click="onClickDetail(scope.row)" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>
    <loading :show="loading" message="情報の取得中です"/>
    <notification ref="notification"/>
  </div>
</template>

<script>
import Loading from '../common/Loading.vue'
import Notification from '../common/Notification.vue';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";

export default {
  name: "TicketList",
  components: {
    loading: Loading,
    notification: Notification
  },
  mixins: [Util, Disp],
  data() {
    return {
      loading: false,
      projectId: this.$store.state.c.auth.ProjectId,
      accountId: this.$store.state.c.auth.AccountId,
      defaultSort: { prop: "UpdatedAt", order: "descending" }
    };
  },
  computed: {
    tickets() { return this.$store.getters.getTicketList(); }
  },
  methods: {
    async onClickDetail(ticket){
      try{
        if(!this.$store.getters.isTicketLoaded(ticket.TicketId)){
          this.loading = true;
          await this.$store.dispatch("reqGetTicket", {
            id: ticket.TicketId,
            projectId: ticket.OwnerProjectId,
            accountId: ticket.OwnerAccountId
          });
        }
        this.$router.push({
          path: "show-ticket.html",
          query: { id: ticket.TicketId },
        });
      }catch(e){
        await this.$refs.notification.notify({
          status: "error",
          title: this.$page.title,
          message: e.message
        });
        this.$store.commit("clearTicketResults")
        this.$router.push({ path: "get-tickets.html" });
      }finally{
        this.loading = false;
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