<template>
  <div id="TicketContentSimple">
    <el-form-item label="備考">
      <el-input
        v-model="note"
        v-if="!readOnly"
        type="textarea"
        :rows="2"
        placeholder="連絡事項がある場合は、こちらにご記入ください。">
      </el-input>
      <span class="form-item" v-else>{{content.Note}}</span>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name : "TicketContentSimple",
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default : "REQ_OTHER"
    }
  },
  computed: {
    //for Display
    content() {
      if(this.id.length > 0){
        return this.$store.getters.getTicketById(this.id).Content;
      }else{
        return this.$store.getters.getDummyTicket();
      }
    },
    //Store processing
    note: {
      get(){
        if(this.isUpdate){
          return this.$store.state.t.updateParams.Content.Note;
        }else{
          return this.$store.state.t.createParams.Content[this.type].Note 
        }
      },
      set(value){ this.$store.commit(this.isUpdate ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Note", val: value}) },
    },
    isCreate(){ return this.id.length === 0 },
    isUpdate(){ return this.id.length > 0 }
  }
}
</script>

<style scoped>
</style>