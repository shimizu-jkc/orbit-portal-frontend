<template>
  <div id="AccountInfo">
    <el-form 
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditable('page')?'top':'left'"
    >
      <el-form-item label="所属プロジェクト名" v-if="isReadOnly">
        <span class="form-item">{{account.OwnerProjectId}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境ID" v-if="isReadOnly">
        <span class="form-item">{{account.AccountId}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境名" v-if="isReadOnly">
        <span class="form-item">{{account.AccountName}}</span>
      </el-form-item>
      <el-form-item label="クラウド環境Eメールアドレス" v-if="isReadOnly">
        <span class="form-item">{{account.AccountEmail}}</span>
      </el-form-item>
      <el-form-item label="ステータス" v-if="isReadOnly">
        <span class="form-item">{{getDispStatusName(account.Status)}}</span>
      </el-form-item>
      <el-form-item label="利用目的">
        <el-select 
          class="select-env"
          v-model="env" 
          v-if="isEditable('env')"
          placeholder="利用目的を選択してください。"
        >
          <el-option label="本番" value="PRD"></el-option>
          <el-option label="ステージング" value="STG"></el-option>
          <el-option label="開発" value="DEV"></el-option>
          <el-option label="概念検証" value="POC"></el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispEnvName(account.Env)}}
          <span class="attention" v-show="operation=='update'">※利用目的は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="申請ファイル" v-if="isCreate">
        <el-upload
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
      </el-form-item>
      <el-form-item label="OW部門コード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの部門コードを入力してください"
          v-model="billingOWDepartmentCode"
          v-if="isEditable('billingOWDepartmentCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{account.BillingOWDepartmentCode}}
        </span>
      </el-form-item>
      <el-form-item label="OW科目コード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの科目コードを入力してください"
          v-model="billingOWUsageCode"
          v-if="isEditable('billingOWUsageCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{account.BillingOWUsageCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトコード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトコードを入力してください"
          v-model="billingProjectCode"
          v-if="isEditable('billingProjectCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{account.BillingProjectCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトサブコード">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトサブコードを入力してください"
          v-model="billingProjectSubCode"
          v-if="isEditable('billingProjectSubCode')"
        ></el-input>
        <span class="form-item" v-else>
          {{account.BillingProjectSubCode}}
        </span>
      </el-form-item>
      <el-form-item label="実運用予定日">
        <div id="EditableOpsDate" v-if="isEditable('operationDate')">
          <el-row>
            <el-col :span="2">
              <span class="date-label">開始予定日</span>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="startOperationDate"
                type="date"
                placeholder="日付を選択してください。"
                format="yyyy年M月d日"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="2">
              <span class="date-label">終了予定日</span>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="expireOperationDate"
                type="date"
                placeholder="日付を選択してください。"
                format="yyyy年M月d日"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </div>
        <div id="ReadOnlyOpsDate" v-else>
          <span class="form-item">{{epochSecToJST(account.StartOperationDate)}}</span>
          <span class="form-item">～</span>
          <span class="form-item">{{epochSecToJST(account.ExpireOperationDate)}}</span>
        </div>
      </el-form-item>
      <el-form-item label="役割">
        <div class="form-item">
          <roles :readOnly="!isEditable('memberRoles')" :id="id"/>
        </div>
      </el-form-item>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(account.CreatedAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(account.UpdatedAt)}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberRoleList from './MemberRoleList';
import Util from "../../mixins/util";

export default {
  name: "AccountInfo",
  components : {
    roles: MemberRoleList
  },
  mixins: [Util],
  props: {
    operation: {
      type: String,
      default: "read",
      validator(value){
        return ["create","get","show","update","delete"].indexOf(value) !== -1;
      }
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: '明日',
            onClick(picker){
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '５営業日後',
            onClick(picker){
              const date = new Date();
              switch(date.getDay){
                case 0  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 5); 
                case 6  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 6); 
                default : date.setTime(date.getTime() + 3600 * 1000 * 24 * 7); 
              }
              picker.$emit('pick', date);
            }
          }
        ]
      },
      fileList: []
    }
  },
  computed: {
    //for display
    account() {
      const account = this.$store.getters.getAccountById(this.id);
      if(!account && this.needAccount){
        this.$router.push({ path: "get-account.html" });
        return this.$store.getters.getDummyAccount();
      }else{
        return account;
      }
    },
    //Store processing
    env: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].Env },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "Env", val: value}) }
    },
    billingOWDepartmentCode: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].BillingOWDepartmentCode },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "BillingOWDepartmentCode", val: value}) }
    },
    billingOWUsageCode: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].BillingOWUsageCode },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "BillingOWUsageCode", val: value}) }
    },
    billingProjectCode: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].BillingProjectCode },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "BillingProjectCode", val: value}) }
    },
    billingProjectSubCode: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].BillingProjectSubCode },
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "BillingProjectSubCode", val: value}) }
    },
    startOperationDate: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].StartOperationDate * 1000}, //From msec to sec
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "StartOperationDate", val: this.DateToEpochSec(value)}) }
    },
    expireOperationDate: {
      get() { return this.$store.state.a[this.isUpdate ? "updateParams":"createParams"].ExpireOperationDate * 1000 }, //From msec to sec
      set(value){ this.$store.commit(this.isUpdate ? "setAccountUpdateParams":"setAccountCreateParams", {name: "ExpireOperationDate", val: this.DateToEpochSec(value)}) }
    },
    isEditable(){
      return (target) => {
        switch(this.operation){
          case "create": return true;
          case "update": {
            switch(target){
              case "page":
              case "billingOWDepartmentCode":
              case "billingOWUsageCode":
              case "billingProjectCode":
              case "billingProjectSubCode":
              case "operationDate":
              case "memberRoles": return true;
              default: return false;
            }
          }
          case "get":
          case "show":  
          case "delete":
          default: return false;
        }
      }
    },
    isReadOnly(){ return this.isShow || this.isDelete },
    needAccount() { return this.isShow || this.isUpdate },
    isCreate(){ return this.operation === "create" },
    isShow(){ return this.operation === "show" },
    isUpdate(){ return this.operation === "update" },
    isDelete(){ return this.operation === "delete" }
   },
   methods:{
    getDispEnvName(val){
      switch(val){
        case "PRD": return "本番";
        case "STG": return "ステージング";
        case "DEV": return "開発";
        case "POC": return "概念検証";
        default : return "不明";
      }
    },
    getDispStatusName(val){
      switch(val){
        case "WAITING_CONFIRM"  : return "承認待ち";
        case "CONFIRM"          : return "承認済み";
        case "REJECT"           : return "却下";
        case "PREPARING"        : return "準備中";
        case "CREATE_START"     : return "作成開始";
        case "CREATING"         : return "作成中";
        case "CREATE_FAILED"    : return "作成失敗";
        case "CREATE_COMPLETED" : return "作成済み";
        case "AVAILABLE"        : return "有効";
        case "WAITING_DELETE"   : return "削除待ち";
        case "DELETE_START"     : return "削除中";
        case "DELETE_COMPLETED" : return "削除済み";
        default                 : return "不明な状態";
      }
    },
    getFileUrl(val){
      console.log(val);
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