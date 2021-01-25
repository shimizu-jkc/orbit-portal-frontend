<template>
  <div id="AccountInfo">
    <el-form
      ref="form"
      inline-message
      status-icon
      label-width="25%"
      :label-position="isEditableAttr('page')?'top':'left'"
      :model="accountModel"
      :rules="rules"
      :hide-required-asterisk="!isEditable"
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
      <el-form-item label="利用目的" prop="Env">
        <el-select 
          class="select-env"
          v-model="env"
          v-if="isEditableAttr('Env')"
          @change="onEnvChanged"
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
      <el-form-item v-if="isPrd" :error="fileError" label="申請ファイル">
        <files
          class="form-item"
          v-if="isExist"
          v-model="files"
          clickable
          :deletable="!isReadOnly"
          :download-status="downloadStatus"
          @click="onClickFile"
        ></files>
        <upload
          class="form-item"
          v-if="isEditableAttr('Files')"
          v-model="uploadList"
          :limit="3"
          :max-size="100*1000*1000"
          :before-add="beforeAddFile"
          :on-error="onFileError"
        ></upload>
      </el-form-item>
      <el-form-item label="OW部門コード" prop="BillingOWDepartmentCode">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの部門コードを入力してください"
          v-model="billingOWDepartmentCode"
          v-if="isEditableAttr('BillingOWDepartmentCode')"
          maxlength=7
        ></el-input>
        <span class="form-item" v-else>
          {{billingOWDepartmentCode}}
        </span>
      </el-form-item>
      <el-form-item label="OW科目コード" prop="BillingOWUsageCode">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるOneWorldの科目コードを入力してください"
          v-model="billingOWUsageCode"
          v-if="isEditableAttr('BillingOWUsageCode')"
          maxlength=10
        ></el-input>
        <span class="form-item" v-else>
          {{billingOWUsageCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトコード" prop="BillingProjectCode">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトコードを入力してください"
          v-model="billingProjectCode"
          v-if="isEditableAttr('BillingProjectCode')"
          maxlength=254
        ></el-input>
        <span class="form-item" v-else>
          {{billingProjectCode}}
        </span>
      </el-form-item>
      <el-form-item label="プロジェクトサブコード" prop="BillingProjectSubCode">
        <el-input 
          type="text"
          placeholder="利用料金の配賦先となるプロジェクトサブコードを入力してください"
          v-model="billingProjectSubCode"
          v-if="isEditableAttr('BillingProjectSubCode')"
          maxlength=254
        ></el-input>
        <span class="form-item" v-else>
          {{billingProjectSubCode}}
        </span>
      </el-form-item>
      <el-form-item v-if="isPrd" label="実運用予定日" prop="StartOperationDate">
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
      <el-form-item label="プロジェクトメンバーの役割" required>
        <div class="form-item">
          <roles ref="roles" :readOnly="!isEditableAttr('MemberRoles')" :id="id"/>
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
import FileUpload from './FileUpload';
import FileList from './FileList';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";
import AccountApi from "../../api/AccountApi"
import FileSaver from "file-saver";

export default {
  name: "AccountInfo",
  components : {
    roles: MemberRoleList,
    upload: FileUpload,
    files: FileList
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
          switch(date.getDay()){
            case 0  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 5); 
            case 6  : date.setTime(date.getTime() + 3600 * 1000 * 24 * 6); 
            default : date.setTime(date.getTime() + 3600 * 1000 * 24 * 7); 
          }
          return time.getTime() < date.getTime();
        }
      },
      fileError: "",
      downloadStatus: {},
      rules: {
        Env: [
          { required: true, message: "利用目的は必須です。" }
        ],
        BillingOWDepartmentCode: [
          { required: true, message: "OW部門コードは必須です。", trigger: "blur" },
          { pattern: /^[0-9]{7}$/, 
            message: "OW部門コードは7桁の数字を入力してください。", trigger: "blur" }
        ],
        BillingOWUsageCode: [
          { required: true, message: "OW科目コードは必須です。", trigger: "blur" },
          { pattern: /^[0-9]{5}(?:-[0-9]{4})?$/, 
            message: "OW科目コードは5桁または5桁-4桁の数字を入力してください。", trigger: "blur" }
        ],
        BillingProjectCode: [
          // no specific rules
        ],
        BillingProjectSubCode: [
          // no specific rules
        ],
        StartOperationDate: [
          { required: true, type:"number", min: 1, message: "実運用予定日は必須です。" }
        ],
        ExpireOperationDate: [
          // check only startDate (el-form restriction)
        ]
      }
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
    accountModel() {
      if(this.isCreate){
        return this.$store.state.a.createParams;
      }else if(this.isUpdate){
        return this.$store.state.a.updateParams;
      }else{
        return this.account;
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
    files: {
      get() { return this.getter("Files"); },
      set(value){ this.setter({ name: "Files", val: value }); }      
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
      get(){
        const start = this.getter("StartOperationDate");
        const expire = this.getter("ExpireOperationDate");
        return (start && expire) ? [start * 1000, expire * 1000] : null;
      },
      set(value){
        this.setter({ name: "StartOperationDate", val: this.DateToEpochSec(value ? value[0] : 0) });
        this.setter({ name: "ExpireOperationDate", val: this.DateToEpochSec(value ? value[1] : 0) });
      }
    },
    uploadList: {
      get() { return this.$store.state.a.uploadList; },
      set(value){ this.$store.commit("setAccountUploadList", value); }   
    },
    isPrd(){
      return this.env === "PRD";
    },
    isEditableAttr(){
      return (target) => {
        switch(this.operation){
          case "create": {
            switch(target){
              case "page":
              case "Env":
              case "Files":
              case "BillingOWDepartmentCode":
              case "BillingOWUsageCode":
              case "BillingProjectCode":
              case "BillingProjectSubCode":
              case "OperationDate":
              case "StartOperationDate":
              case "ExpireOperationDate":
              case "MemberRoles": return true;
              default: return false;
            }
          }
          case "update": {
            switch(target){
              //case "page":
              case "Files":
              case "BillingOWDepartmentCode":
              case "BillingOWUsageCode":
              case "BillingProjectCode":
              case "BillingProjectSubCode":
              case "OperationDate":
              case "StartOperationDate":
              case "ExpireOperationDate":
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
    async validate() {
      return new Promise((resolve, reject) => {
        // el-form validator
        this.$refs["form"].validate((valid, detail) => {
          const format = (messages) => {
            return messages.map(m => "・" + m).join("\n");
          };
          let messages = [];
          // check form
          Object.keys(detail).forEach(d => {
            if(this.isEditableAttr(d)){
              messages.push(detail[d][0].message);
            }
          });
          // check roles
          messages = messages.concat(this.$refs["roles"].validate());
          if(!messages.length){
            resolve();
          }else{
            reject(new Error(format(messages)));
          }
        });
      });
    },
    onEnvChanged(val) {
      if(val !== "PRD") {
        // clear related data
        this.files = [];
        this.uploadList = [];
        this.operationDate = null;
      }
    },
    beforeAddFile(filename) {
      if(this.files.some(f => f === filename)) {
        this.fileError = "同名のファイルは上書きされます。";
        return true;  // allow
      }
      if([...new Set(this.files.concat(this.uploadList.map(f => f.name)))].length >= 3){
        this.fileError = "申請できるファイルは合計3つまでです。";
        return false;
      }
      this.fileError = "";
      return true;
    },
    onFileError(message) {
      this.fileError = message;
    },
    async onClickFile(filename) {
      // download
      const api = new AccountApi(this.projectId);
      const updateDownloadStatus = (message, progress, status="success") => {
        this.downloadStatus = Object.assign({}, this.downloadStatus, {
          [filename]: {
            message: message,
            progress: progress,
            status: status
          }
        });
      };
      updateDownloadStatus("ダウンロードの準備中です...", 0);
      try {
        const [url] = await api.getAccountUrls(this.accountId, [filename], "READ");
        const blob = await api.download(url, (progress) => {
          updateDownloadStatus("ダウンロードしています...", progress);
        });
        FileSaver(blob, filename);
        updateDownloadStatus("ダウンロードが完了しました。", 100);
      } catch(e) {
        console.error(e);
        updateDownloadStatus(e.message, 0, "exception");
      }
    }
  },
  created(){
    // always clear upload list
    this.$store.commit("setAccountUploadList", []);
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
</style>