<template>
  <div id="TicketContentAuditLog">
    <el-row :gutter="4">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="備考"
        v-model="note">
      </el-input>
    </el-row>
  </div>
</template>

<script>
export default {
  name : "TicketContentCfKeypair",
  props: {},
  computed: {
    //Store processing
    note: {
      get(){return ""}
      /*
      get(){ return this.$store.state.t[this.isUpdate ? "updateParams":"createParams"][this.type].Note },
      set(value){ this.$store.commit(this.isUpdate ? "setUpdateParams":"setCreateParams", {type: this.type, name: "Note", val: value}) }
      */    }
  },
  methods: {}
}
</script>

<style scoped>
</style>