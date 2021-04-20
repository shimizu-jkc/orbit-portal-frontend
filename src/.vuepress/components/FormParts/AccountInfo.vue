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
      :hide-required-asterisk="!isCreate"
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
      <el-form-item v-show="isExist">
        <span slot="label">クラウド環境Eメールアドレス
          <hint>
            ルートユーザーのEメールアドレスです。<br>
            詳細は
            <el-link type="primary" href="/guide/aws/service/account-management.html#ルートユーザーのeメールアドレス" target="_blank">こちら</el-link>
            を参照してください。
          </hint>
        </span>        
        <span class="form-item">{{accountEmail}}</span>
      </el-form-item>
      <el-form-item label="ステータス" v-show="isExist">
        <span class="form-item">{{getDispName("AccountStatus", status)}}</span>
      </el-form-item>
      <el-form-item label="" prop="Env">
        <span slot="label">利用目的
          <hint v-show="isEditableAttr('Env')">
            利用目的の詳細は
            <el-link type="primary" href="/guide/aws/service/account-management.html#利用目的" target="_blank">こちら</el-link>
            を参照してください。
          </hint>
        </span>
        <div class="form-item">
          <el-select 
            class="form-item-vshort"
            v-model="env"
            v-if="isEditableAttr('Env')"
            @change="onEnvChanged"
            placeholder="利用目的を選択してください"
          >
            <el-option
              v-for="(item, index) in getDispNameSets('Env')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
          <span v-else>
            {{getDispName("Env", env)}}
            <span class="attention" v-show="isUpdate">※利用目的は変更できません</span>
          </span>
        </div>
      </el-form-item>
      <el-form-item v-show="isPrd" prop="StartOperationDate">
        <span slot="label">実運用予定日
          <hint v-show="isEditableAttr('OperationDate')">
            5営業日以降から選択できます。
          </hint>
        </span>
        <div class="form-item">
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
          </div>
          <div id="ReadOnlyOpsDate" v-else>
            <span>{{epochSecToJST(startOperationDate)}}</span>
            <span>～</span>
            <span>{{epochSecToJST(expireOperationDate)}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="isPrd" :error="fileError" label="申請ファイル">
        <div class="form-item">
          <files
            v-if="isExist"
            v-model="files"
            clickable
            :deletable="!isReadOnly"
            :download-status="downloadStatus"
            @click="onClickFile"
          ></files>
          <upload
            v-if="isEditableAttr('Files')"
            v-model="uploadList"
            :limit="3"
            :max-size="100*1000*1000"
            :button-size="isUpdate ? 'mini' : 'medium'"
            :before-add="beforeAddFile"
            :on-error="onFileError"
          ></upload>
        </div>
      </el-form-item>
      <el-form-item prop="BillingAFFCode">
        <span slot="label">AFFコード
          <hint v-show="isEditableAttr('BillingAFFCode')">
            AFF(会計フレックスフィールド)コードは10個のコードをドットでつないだ文字列です。
          </hint>
        </span>
        <div class="form-item">
          <el-input
            class="form-item-medium"
            type="text"
            placeholder="利用料金の配賦先となる会計フレックスフィールドコードを入力してください"
            v-model="billingAFFCode"
            v-if="isEditableAttr('BillingAFFCode')"
            minlength=35
            maxlength=100
          ></el-input>
          <span v-else>{{billingAFFCode}}</span>
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
      <el-form-item label="登録者" v-if="isReadOnly">
        <span class="form-item">{{wrapAdmin(createdBy)}}</span>
      </el-form-item>
      <el-form-item label="最終更新者" v-if="isReadOnly">
        <span class="form-item">{{wrapAdmin(updatedBy)}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberRoleList from './MemberRoleList';
import FileUpload from './FileUpload';
import FileList from './FileList';
import ItemHint from '../common/ItemHint';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";
import AccountApi from "../../api/AccountApi"
import FileSaver from "file-saver";

export default {
  name: "AccountInfo",
  components : {
    roles: MemberRoleList,
    upload: FileUpload,
    files: FileList,
    hint: ItemHint
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
        BillingAFFCode: [
          { required: true, message: "AFFコードは必須です。", trigger: "blur" },
          { pattern: /^\d{4}\.\d{6}\.\w{4}\.\w{5}\.\d{3}\.\d{7}\.\w{6}\..+$/, 
            message: "AFFコードが不正な形式です。", trigger: "blur" }
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
          //this.$router.push({ path: "get-account.html" });
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
    createdBy: {
      get() { return this.getter("CreatedBy", true); },
    },
    updatedBy: {
      get() { return this.getter("UpdatedBy", true); },
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
    billingAFFCode: {
      get() { return this.getter("BillingAFFCode"); },
      set(value){ this.setter({ name: "BillingAFFCode", val: value }); }
    },
    operationDate: {
      get(){
        const start = this.getter("StartOperationDate");
        const expire = this.getter("ExpireOperationDate");
        return (start && expire) ? [start * 1000, expire * 1000] : null;
      },
      set(value){
        this.setter({ name: "StartOperationDate", val: this.DateToEpochSec(value ? value[0] : 0) });
        this.setter({ name: "ExpireOperationDate", val: this.DateToEpochSec(
          value ? this.getLastTimeOfDay(value[1]) : 0) });
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
              case "BillingAFFCode":
              case "MemberRoles": return true;
              case "Files":
              case "OperationDate":
              case "StartOperationDate":
              case "ExpireOperationDate": return this.isPrd;
              default: return false;
            }
          }
          case "update": {
            switch(target){
              //case "page":
              case "BillingAFFCode":
              case "MemberRoles": return true;
              case "Files":
              case "OperationDate":
              case "StartOperationDate":
              case "ExpireOperationDate": return this.isPrd;
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
    beforeAddFile(filename, uploadList) {
      if(this.files.some(f => f === filename)) {
        this.fileError = "同名のファイルは上書きされます。";
        return true;  // allow
      }
      if([...new Set(this.files.concat(uploadList.map(f => f.name)))].length >= 3){
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
        // [#53] force erase blob type for FireFox
        FileSaver(blob.slice(0, blob.size, ""), filename);
        updateDownloadStatus("ダウンロードが完了しました。", 100);
      } catch(e) {
        console.error(e);
        updateDownloadStatus(e.message, 0, "exception");
      }
    }
  },
  mounted(){
    // Return to the auth page when reloading
    if(this.id && !this.$store.getters.getAccountById(this.id)){
      this.$router.push({ path: "get-account.html" });
      return;
    }
    // Return to the auth page when query is empty
    if(this.isExist && !this.id){
      this.$router.push({ path: "get-account.html" });
      return;
    }
    // always clear upload list
    this.$store.commit("setAccountUploadList", []);
  }
}
</script>

<style scoped>
.date-label {
  display: block;
  text-align: center;
  color: #8492a6;
  font-size: 0.8rem;
}
</style>
