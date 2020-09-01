<template>
  <div id="TicketContentAuditLog">
    <el-form-item label="対象サービス">
      <el-select 
        v-model="service" 
        v-if="!readOnly"
        placeholder="確認したいサービスを選択してください。"
      >
        <el-option
          v-for="(item, index) in getDispNameSets('ServiceForAudit')"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="form-item" v-else>
        {{getDispName("ServiceForAudit", service)}}
      </span>
    </el-form-item>
    <el-form-item label="確認期間">
      <div id="EditableAuditDate" v-if="!readOnly">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="~"
          start-placeholder="開始時刻"
          end-placeholder="終了時刻">
        </el-date-picker>
      </div>
      <div id="ReadOnlyAuditDate" v-else>
        <span class="form-item">{{epochSecToJST(startDate)}}</span>
        <span class="form-item">～</span>
        <span class="form-item">{{epochSecToJST(endDate)}}</span>
      </div>
    </el-form-item>
    <el-form-item label="備考">
      <el-input
        v-model="note"
        v-if="!readOnly"
        type="textarea"
        :rows="2"
        placeholder="連絡事項がある場合は、こちらにご記入ください。">
      </el-input>
      <span class="form-item" v-else>{{note}}</span>
    </el-form-item>
  </div>
</template>

<script>
import Util from "../../../mixins/util";
import Disp from "../../../mixins/disp";

export default {
  name : "TicketContentAuditLog",
  mixins: [Util, Disp],
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
      type: "REQ_AUDIT_LOG",
      dateSet: ""
    };
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
    //ReadOnly
    startDate: {
      get(){ return this.content.StartDate; }
    },
    endDate: {
      get(){ return this.content.EndDate; }
    },
    //Store processing
    service: {
      get(){
        if(this.hasId && this.readOnly){
          return this.content.Service;
        }else if(this.hasId && !this.readOnly){
          return this.$store.state.t.updateParams.Content.Service;
        }else{
          return this.$store.state.t.createParams.Content[this.type].Service 
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Service", val: value}) }
    },
    date: {
      get(){ return this.hasId ? [this.$store.state.t.updateParams.Content.StartDate * 1000, this.$store.state.t.updateParams.Content.EndDate * 1000] : this.dateSet; },
      set(value){
        this.dateSet = value;
        this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::StartDate", val: this.DateToEpochSec(value ? value[0] : 0)});
        this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::EndDate", val: this.DateToEpochSec(value ? value[1] : 0)});
      }
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
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Note", val: value}) }
    },
    hasId(){ return this.id.length > 0 }
  },
  methods: {}
}
</script>

<style scoped>
</style>