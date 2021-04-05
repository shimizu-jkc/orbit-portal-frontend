<template>
  <div id="TicketContentAuditLog">
    <el-form
      ref="form"
      inline-message
      status-icon
      label-width="25%"
      :label-position="isCreate ?'top':'left'"
      :model="contentModel"
      :rules="rules"
      :hide-required-asterisk="!isCreate"
    >
      <el-form-item label="対象サービス" prop="Service">
        <div class="form-item">
          <el-select
            class="form-item-vshort"
            v-model="service" 
            v-if="!isReadOnly"
            placeholder="確認したいサービスを選択してください"
          >
            <el-option
              v-for="(item, index) in getDispNameSets('ServiceForAudit')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span v-else>
            {{getDispName("ServiceForAudit", service)}}
          </span>
        </div>
      </el-form-item>
      <el-form-item prop="StartDate">
        <span slot="label">確認期間
          <hint>
            ログを確認したい期間を選択してください。<br>
            期間は時分秒まで指定することができます。<br>
            ただし、一度に依頼できる期間は最大で30日間です。
          </hint>
        </span>
        <div class="form-item">
          <div id="EditableAuditDate" v-if="!isReadOnly">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              range-separator="~"
              start-placeholder="開始時刻"
              end-placeholder="終了時刻"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
          <div id="ReadOnlyAuditDate" v-else>
            <span >{{epochSecToJST(startDate)}}</span>
            <span >～</span>
            <span >{{epochSecToJST(endDate)}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="備考" prop="Note">
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
import Util from "../../../mixins/util";
import Disp from "../../../mixins/disp";
import ItemHint from "../../common/ItemHint";

export default {
  name : "TicketContentAuditLog",
  components : {
    hint: ItemHint
  },
  mixins: [Util, Disp],
  props: {
    operation: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      type: "REQ_AUDIT_LOG",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().setHours(23, 59, 59);
        },
        shortcuts: [{
          text: "今日",
          onClick(picker) {
            const start = new Date();
            const end = new Date(start);
            start.setHours(0, 0, 0);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "昨日",
          onClick(picker) {
            const start = new Date();
            start.setDate(start.getDate() - 1);
            const end = new Date(start);
            start.setHours(0, 0, 0);
            end.setHours(23, 59, 59);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近7日間",
          onClick(picker) {
            const start = new Date();
            const end = new Date(start);
            start.setDate(start.getDate() - 7);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近30日間",
          onClick(picker) {
            const start = new Date();
            const end = new Date(start);
            start.setDate(start.getDate() - 30);
            picker.$emit("pick", [start, end]);
          }
        }],
      },
      rules: {
        Service: [
          { required: true, message: "対象サービスは必須です。" }
        ],
        StartDate: [
          { required: true, type:"number", min: 1, message: "確認期間は必須です。" },
          { validator: (r, v, callback) => {
            if(this.date) {
              const start = new Date(this.date[0]);
              const end = new Date(this.date[1]);
              if(start.getTime() === end.getTime()){
                callback("確認期間の開始時刻と終了時刻が同じです。");
              }
              if(start < end.setDate(end.getDate() - 30)) {
                callback("一度に依頼できる期間は最大で30日間です。");
              }
            }
          }}
        ],
        EndDate: [
          // check only startDate (el-form restriction)
        ],
        Note: [
          // no specific rules
        ]
      }
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
    contentModel() {
      if(this.hasId){
        return this.$store.state.t.updateParams.Content;
      }else{
        return this.$store.state.t.createParams.Content[this.type];
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
        if(this.hasId && this.isReadOnly){
          return this.content.Service;
        }else if(this.hasId && !this.isReadOnly){
          return this.$store.state.t.updateParams.Content.Service;
        }else{
          return this.$store.state.t.createParams.Content[this.type].Service;
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Service", val: value}) }
    },
    date: {
      get(){
        let start, end;
        if(this.hasId && this.isReadOnly){
          start = this.content.StartDate;
          end = this.content.EndDate;
        }else if(this.hasId && !this.isReadOnly){
          start = this.$store.state.t.updateParams.Content.StartDate;
          end = this.$store.state.t.updateParams.Content.EndDate;
        }else{
          start = this.$store.state.t.createParams.Content[this.type].StartDate;
          end = this.$store.state.t.createParams.Content[this.type].EndDate;
        }
        return (start && end) ? [start * 1000, end * 1000] : null;
      },
      set(value){
        this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::StartDate", val: this.DateToEpochSec(value ? value[0] : 0)});
        this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::EndDate", val: this.DateToEpochSec(value ? value[1] : 0)});
      }
    },
    note: {
      get(){
        if(this.hasId && this.isReadOnly){
          return this.content.Note;
        }else if(this.hasId && !this.isReadOnly){
          return this.$store.state.t.updateParams.Content.Note;
        }else{
          return this.$store.state.t.createParams.Content[this.type].Note;
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::Note", val: value}); }
    },
    hasId(){ return this.id.length > 0 }
  },
  methods: {
    async validate() {
      return new Promise((resolve, reject) => {
        // el-form validator
        this.$refs["form"].validate((valid, detail) => {
          if(this.isReadOnly){
            resolve([]);
          }else{
            resolve(Object.keys(detail).map(d => detail[d][0].message));
          }
        });
      });
    }    
  }
}
</script>

<style scoped>
</style>