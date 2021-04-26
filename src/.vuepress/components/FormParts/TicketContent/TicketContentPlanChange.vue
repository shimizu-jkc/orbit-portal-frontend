<template>
  <div id="TicketContentPlanChange">
    <el-form
      ref="form"
      inline-message
      status-icon
      label-width="25%"
      :label-position="isCreate ? 'top':'left'"
      :model="contentModel"
      :rules="rules"
      :hide-required-asterisk="!isCreate"
    >
      <el-form-item prop="ExpectedPlan">
        <span slot="label">サポートプラン
          <hint v-show="isEditable">
            サポートプランの詳細は
            <el-link type="primary" href="https://aws.amazon.com/jp/premiumsupport/plans/" target="_blank">こちら</el-link>
            を参照してください。
          </hint>
        </span>
        <div class="form-item">
          <el-select
            class="form-item-vshort"
            v-model="plan" 
            v-if="!isReadOnly"
            placeholder="変更先のプランを選択してください"
          >
            <el-option
              v-for="(item, index) in getDispNameSets('SupportPlan')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span v-else>
            {{getDispName("SupportPlan", plan)}}
          </span>
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
import Disp from "../../../mixins/disp";
import ItemHint from "../../common/ItemHint";

export default {
  name : "TicketContentPlanChange",
  components : {
    hint: ItemHint
  },
  mixins: [Disp],
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
      type: "REQ_SUPPORT_PLAN_CHANGE",
      rules: {
        ExpectedPlan: [
          { required: true, message: "サポートプランは必須です。" }
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
      if(this.id.length > 0){
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
    //Store processing
    plan: {
      get(){
        if(this.hasId && this.isReadOnly){
          return this.content.ExpectedPlan;
        }else if(this.hasId && !this.isReadOnly){
          return this.$store.state.t.updateParams.Content.ExpectedPlan;
        }else{
          return this.$store.state.t.createParams.Content[this.type].ExpectedPlan 
        }
      },
      set(value){ this.$store.commit(this.hasId ? "setTicketUpdateParams":"setTicketCreateParams", {type: this.type, name: "Content::ExpectedPlan", val: value}) },
    },
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