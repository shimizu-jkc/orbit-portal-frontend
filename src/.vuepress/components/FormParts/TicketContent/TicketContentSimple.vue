<template>
  <div id="TicketContentSimple">
    <el-form
      label-width="25%"
      :label-position="isCreate ? 'top':'left'"
    >
      <el-form-item label="備考">
        <div class="form-item">
          <el-input
            v-model="note"
            v-if="!isReadOnly"
            type="textarea"
            :rows="2"
            placeholder="連絡事項がある場合は、こちらにご記入ください">
          </el-input>
          <span v-else>{{note}}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Disp from "../../../mixins/disp";

export default {
  name : "TicketContentSimple",
  mixins: [Disp],
  props: {
    operation: {
      type: String,
      default: ""
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
      if(this.hasId){
        return this.$store.getters.getTicketById(this.id).Content;
      }else{
        return this.$store.getters.getDummyTicket();
      }
    },
    //Store processing
    note: {
      get(){
        if(this.hasId && this.isReadOnly){
          return this.content.Note;
        }else if(this.hasId && !this.isReadOnly){
          return this.$store.state.t.updateParams.Content.Note;
        }else{
          return this.$store.state.t.createParams.Content[this.type].Note 
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Note", val: value}) },
    },
    hasId(){ return this.id.length > 0 }
  }
}
</script>

<style scoped>
</style>