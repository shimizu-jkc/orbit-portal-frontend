<template>
  <div id="TicketContentPlanChange">
    <el-form-item label="サポートプラン">
      <el-select
        v-model="plan" 
        v-if="!this.readOnly"
        placeholder="変更先のサポートプランを選択してください。"
      >
        <el-option
          v-for="(item, index) in getDispNameSets('SupportPlan')"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="form-item" v-else>
        {{getDispName("SupportPlan", plan)}}
      </span>
    </el-form-item>
    <el-form-item label="備考">
      <el-input
        v-model="note"
        v-if="!this.readOnly"
        type="textarea"
        :rows="2"
        placeholder="連絡事項がある場合は、こちらにご記入ください。">
      </el-input>
      <span class="form-item" v-else>{{note}}</span>
    </el-form-item>
  </div>
</template>

<script>
import Disp from "../../../mixins/disp";

export default {
  name : "TicketContentPlanChange",
  mixins: [Disp],
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      type: "REQ_SUPPORT_PLAN_CHANGE",
      dateSet: ""
    };
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
    plan: {
      get(){
        if(this.hasId && this.readOnly){
          return this.content.ExpectedPlan;
        }else if(this.hasId && !this.readOnly){
          return this.$store.state.t.updateParams.Content.ExpectedPlan;
        }else{
          return this.$store.state.t.createParams.Content[this.type].ExpectedPlan 
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::ExpectedPlan", val: value}) },
    },
    note: {
      get(){
        if(this.hasId && this.readOnly){
          return this.content.Note;
        }else if(this.hasId && !this.readOnly){
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