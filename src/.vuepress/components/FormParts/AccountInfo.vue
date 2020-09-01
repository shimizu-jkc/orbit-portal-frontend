<template>
  <div id="AccountInfo">
    <el-form 
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditableAttr('page')?'top':'left'"
    >
      <el-form-item label="クラウド環境ID" v-show="isExist">
        <span class="form-item">{{accountId}}</span>
      </el-form-item>
      <el-form-item label="プロジェクト名">
        <span class="form-item">{{projectId}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境名" v-show="isExist">
        <span class="form-item">{{accountName}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境Eメールアドレス" v-show="isExist">
        <span class="form-item">{{accountEmail}}</span>
      </el-form-item>
      <el-form-item label="ステータス" v-show="isExist">
        <span class="form-item">{{getDispName("AccountStatus", status)}}</span>
      </el-form-item>
      <el-form-item label="利用目的">
        <el-select 
          class="select-env"
          v-model="env"
          v-if="isEditableAttr('Env')"
          placeholder="利用目的を選択してください。"
        >
         <el-option
            v-for="(item, index) in getDispNameSets('Env')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> 
        <span class="form-item" v-else>
          {{getDispName("Env", env)}}
          <span class="attention" v-show="isUpdate">※利用目的は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="申請ファイル">
        <el-upload
          v-if="isEditable"
          class="file-upload"
          multiple
          action=""
          :auto-upload="false"
          :limit="3"
          :on-exceed="handleFileExceed"
          :file-list="fileList"
        >
          <el-button size="mini" type="primary">ファイルを選択</el-button>
        </el-upload>
        <div v-for="file in fileList" class="form-item">
          <el-button type="text" @click="onClickFileLink(file)" >{{file}}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="OW部門コード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの部門コードを入力してください"
          v-model="billingOWDepartmentCode"
          v-if="isEditableAttr('BillingOWDepartmentCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{billingOWDepartmentCode}}
        </span>
      </el-form-item>
      <el-form-item label="OW科目コード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの科目コードを入力してください"
          v-model="billingOWUsageCode"
          v-if="isEditableAttr('BillingOWUsageCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{billingOWUsageCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトコード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトコードを入力してください"
          v-model="billingProjectCode"
          v-if="isEditableAttr('BillingProjectCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{billingProjectCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトサブコード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトサブコードを入力してください"
          v-model="billingProjectSubCode"
          v-if="isEditableAttr('BillingProjectSubCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{billingProjectSubCode}}
        </span>
      </el-form-item>
      <el-form-item label="実運用予定日">
        <div id="EditableOpsDate" v-if="isEditableAttr('OperationDate')">
          <el-date-picker
            v-model="operationDate"
            type="daterange"
            range-separator="～"
            start-placeholder="開始予定日"
            end-placeholder="終了予定日"
            format="yyyy年M月d日"
            :picker-options="pickerOptions">
          </el-date-picker>
           <span class="attention">※5営業日以降から選択できます。</span>
        </div>
        <div id="ReadOnlyOpsDate" v-else>
          <span class="form-item">{{epochSecToJST(startOperationDate)}}</span>
          <span class="form-item">～</span>
          <span class="form-item">{{epochSecToJST(expireOperationDate)}}</span>
        </div>
      </el-form-item>
      <el-form-item label="プロジェクトメンバーの役割">
        <div class="form-item">
          <roles :readOnly="!isEditableAttr('MemberRoles')" :id="id"/>
        </div>
      </el-form-item>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(createdAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(updatedAt)}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberRoleList from './MemberRoleList';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";

export default {
  name: "AccountInfo",
  components : {
    roles: MemberRoleList
  },
  mixins: [Util, Disp],
  props: {
    id: {
      type: String,
      default: ""
    },
    operation: {
      type: String,
      default: "show",
      validator(value){
        return ["create","show","update","delete"].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          switch(date.getDay){
            case 0  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 5); 
            case 6  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 6); 
            default : date.setTime(date.getTime() + 3600 * 1000 * 24 * 7); 
          }
          return time.getTime() < date.getTime();
        }
      },
      dateSet: "",
      fileList: []
    }
  },
  computed: {
    //for display
    account() {
      if(this.id.length > 0){
        const account = this.$store.getters.getAccountById(this.id);
        if(!account){
          this.$router.push({ path: "get-account.html" });
          return this.$store.getters.getDummyAccount();
        }else{
          return account;
        }
      }else{
        return this.$store.getters.getDummyAccount();
      }
    },   
    //Store processing
    getter() {
      return (attr, readOnly=false) => {
        if(this.isCreate && !readOnly){
          return this.$store.state.a.createParams[attr];
        }else if(this.isUpdate && this.isEditableAttr(attr)){
          return this.$store.state.a.updateParams[attr];
        }else{
          return this.account[attr];
        }
      }
    },
    setter() {
      return (val) => {
        if(this.isCreate){ 
          this.$store.commit("setAccountCreateParams", val);
        }else if(this.isUpdate){ 
          this.$store.commit("setAccountUpdateParams", val);
        }else{
          console.error(`${val} is not editable.`);
        }
      }
    },
    //Authenticated value
    projectId: {
      get() { return this.isCreate ? this.$store.state.c.auth.ProjectId : this.getter("OwnerProjectId", true) },
    },
    //ReadOnly value
    accountId: {
      get() { return this.getter("AccountId", true); }
    },
    accountName: {
      get() { return this.getter("AccountName", true); }
    },
    accountEmail: {
      get() { return this.getter("AccountEmail", true); }
    },
    status: {
      get() { return this.getter("Status", true); },
    },
    startOperationDate: {
      get() { return this.getter("StartOperationDate", true); },
    },
    expireOperationDate: {
      get() { return this.getter("ExpireOperationDate", true); },
    },
    createdAt: {
      get() { return this.getter("CreatedAt", true); },
    },
    updatedAt: {
      get() { return this.getter("UpdatedAt", true); },
    },
    //Editable value
    env: {
      get() { return this.getter("Env"); },
      set(value){ this.setter({ name: "Env", val: value }); }
    },
    billingOWDepartmentCode: {
      get() { return this.getter("BillingOWDepartmentCode"); },
      set(value){ this.setter({ name: "BillingOWDepartmentCode", val: value }); }
    },
    billingOWUsageCode: {
      get() { return this.getter("BillingOWUsageCode"); },
      set(value){ this.setter({ name: "BillingOWUsageCode", val: value }); }
    },
    billingProjectCode: {
      get() { return this.getter("BillingProjectCode"); },
      set(value){ this.setter({ name: "BillingProjectCode", val: value }); }
    },
    billingProjectSubCode: {
      get() { return this.getter("BillingProjectSubCode"); },
      set(value){ this.setter({ name: "BillingProjectSubCode", val: value }); }
    },
    operationDate: {
      get(){ return this.isUpdate ? [this.$store.state.a.updateParams.StartOperationDate * 1000, this.$store.state.a.updateParams.ExpireOperationDate * 1000] : this.dateSet; },
      set(value){
        this.dateSet = value;
        this.setter({ name: "StartOperationDate", val: this.DateToEpochSec(value ? value[0] : 0) });
        this.setter({ name: "ExpireOperationDate", val: this.DateToEpochSec(value ? value[1] : 0) });
      }
    },
    isEditableAttr(){
      return (target) => {
        switch(this.operation){
          case "create": {
            switch(target){
              case "page":
              case "Env":
              case "BillingOWDepartmentCode":
              case "BillingOWUsageCode":
              case "BillingProjectCode":
              case "BillingProjectSubCode":
              case "OperationDate":
              case "MemberRoles": return true;
              default: return false;
            }
          }
          case "update": {
            switch(target){
              //case "page":
              case "BillingOWDepartmentCode":
              case "BillingOWUsageCode":
              case "BillingProjectCode":
              case "BillingProjectSubCode":
              case "OperationDate":
              case "MemberRoles": return true;
              default: return false;
            }
          }
          case "get":
          case "show":  
          case "delete":
          default: return false;
        }
      }
    }
   },
   methods:{
    getFileUrl(val){
      return "";
    },
    handleFileExceed(files, fileList){
      this.$message.warning("申請できるファイルは3つまでです。");
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 30%
}
.el-input-number {
  width: 15%
}
</style>
<style>
.attention {
  margin-left: 1.5em;
  font-size: 80%;
  color: red;
}
.form-item {
  padding: 0 16px;
}
.date-label {
  display: block;
  text-align: center;
  color: #8492a6;
  font-size: 0.8rem;
}
.file-upload {
  width: 25%;
}
.file-upload .el-upload-list__item {
  border-bottom: solid 1px;
  border-block-color: #eaecef;
}

</style>