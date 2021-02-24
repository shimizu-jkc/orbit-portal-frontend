<template>
  <div id="ProjectInfo">
    <el-form 
      ref="form"
      inline-message
      status-icon
      label-width="20%"
      :label-position="isEditableAttr('page')?'top':'left'"
      :model="projectModel"
      :rules="rules"
      :hide-required-asterisk="!isEditable"
    >
      <el-form-item label="プロジェクト名" prop="ProjectId">
        <el-input 
          type="text"
          placeholder="プロジェクトの名称を入力してください"
          v-model="projectId"
          v-if="isEditableAttr('ProjectId')"
          minlength=1
          maxlength=20
          show-word-limit
        ></el-input>
        <span class="form-item" v-else>
          {{projectId}}
          <span class="attention" v-show="isUpdate">※プロジェクト名は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="代表者Eメールアドレス" prop="ProjectEmail">
        <el-input 
          type="text"
          v-if="isEditableAttr('ProjectEmail')"
          placeholder="プロジェクト代表者のEメールアドレスを入力してください"
          v-model="projectEmail"
          maxlength=254
        ></el-input>
        <span class="form-item" v-else>
          {{projectEmail}}
        </span>
      </el-form-item>
      <el-form-item label="事業部" prop="DivisionName">
        <el-select
          v-model="divisionName" 
          v-if="isEditableAttr('DivisionName')"
          placeholder="所属する事業部を選択してください"
        >
         <el-option
            v-for="(item, index) in getDispNameSets('Division')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="form-item" v-else>
          {{getDispName("Division", divisionName)}}
          <span class="attention" v-show="isUpdate">※事業部は変更できません</span>
        </span>
      </el-form-item>
      <el-form-item label="クラウド利用の予算(月額)">
        <div id="EditableBudget" v-if="isEditableAttr('Budget')">
          <el-input-number 
            class="input-number"
            v-model="budget"
            placeholder="0"
            :step="10"
            :min="0" 
            :max="10000"
          ></el-input-number>
          <span> USドル </span>
        </div>
        <span class="form-item" v-else>
          {{budget}} USドル
        </span>
      </el-form-item>
      <el-form-item :error="fileError" label="申請ファイル">
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
      <el-form-item label="プロジェクトメンバー" required>
        <div class="form-item">
          <members ref="members" :readOnly="!isEditableAttr('Members')" :id="id"/>
        </div>
      </el-form-item>
      <el-form-item label="所有クラウド環境" v-show="isReadOnly">
        <div class="form-item" v-for="account in accountIds">
          <el-button type="text" @click="onClickAccountLink(account)" v-if="isReadOnly">{{account}}</el-button>
          <span v-else>{{account}}</span>
        </div>
      </el-form-item>
      <el-form-item label="登録日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(createdAt)}}</span>
      </el-form-item>
      <el-form-item label="最終更新日" v-if="isReadOnly">
        <span class="form-item">{{epochSecToJST(updatedAt)}}</span>
      </el-form-item>
      <el-form-item label="登録者" v-if="isReadOnly">
        <span class="form-item">{{createdBy}}</span>
      </el-form-item>
      <el-form-item label="最終更新者" v-if="isReadOnly">
        <span class="form-item">{{updatedBy}}</span>
      </el-form-item>
      <br>
    </el-form>
  </div>
</template>

<script>
import MemberList from './MemberList';
import FileUpload from './FileUpload';
import FileList from './FileList';
import Util from "../../mixins/util";
import Disp from "../../mixins/disp";
import ProjectApi from "../../api/ProjectApi"
import FileSaver from "file-saver";

export default {
  name: "ProjectInfo",
  components : {
    members: MemberList,
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
      fileError: "",
      downloadStatus: {},
      rules: {
        ProjectId: [
          { required: true, message: "プロジェクト名は必須です。", trigger : "blur" },
          { pattern: /^[a-zA-Z0-9\-]{1,20}$/, 
            message: "プロジェクト名に使用できない文字が含まれています。半角英数字とハイフンのみが使用可能です。" },
          { pattern: /^[^\-]/, 
            message: "プロジェクト名はハイフンから始めることはできません。" },
        ],
        ProjectEmail: [
          { required: true, message: "代表者Eメールアドレスは必須です。", trigger: "blur" },
          { pattern: this.getEmailPattern(), 
            message: "代表者Eメールアドレスはメールアドレス形式で入力してください。", trigger: "blur" }
        ],
        DivisionName: [
          { required: true, message: "事業部は必須です。" }
        ]
      }
    }
  },
  computed: {
    //for display
    project() {
      if(this.id.length > 0){
        const project = this.$store.getters.getProjectById(this.id);
        if(!project){
          //this.$router.push({ path: "get-project.html" });
          return this.$store.getters.getDummyProject();
        }else{
          return project;
        }
      }else{
        return this.$store.getters.getDummyProject();
      }
    },
    projectModel() {
      if(this.isCreate){
        return this.$store.state.p.createParams;
      }else if(this.isUpdate){
        return this.$store.state.p.updateParams;
      }else{
        return this.project;
      }
    },
    //Store processing
    getter() {
      return (attr, readOnly=false) => {
        if(this.isCreate && !readOnly){
          return this.$store.state.p.createParams[attr];
        }else if(this.isUpdate && this.isEditableAttr(attr)){
          return this.$store.state.p.updateParams[attr];
        }else{
          return this.project[attr];
        }
      }
    },
    setter() {
      return (val) => {
        if(this.isCreate){ 
          this.$store.commit("setProjectCreateParams", val);
        }else if(this.isUpdate){ 
          this.$store.commit("setProjectUpdateParams", val);
        }else{
          console.error(`${val} is not editable.`);
        }
      }
    },
    //ReadOnly value
    accountIds: {
      get() { return this.getter("AccountIds", true); },
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
    projectId: {
      get() { return this.getter("ProjectId"); },
      set(value){ this.setter({ name: "ProjectId", val: value }); }
    },
    projectEmail: {
      get() { return this.getter("ProjectEmail"); },
      set(value){ this.setter({ name: "ProjectEmail", val: value }); }
    },
    divisionName: {
      get() { return this.getter("DivisionName"); },
      set(value){ this.setter({ name: "DivisionName", val: value }); }
    },
    budget: {
      get() { return this.getter("Budget"); },
      set(value){ this.setter({ name: "Budget", val: value || 0 }); } // set 0 for empty
    },
    files: {
      get() { return this.getter("Files"); },
      set(value){ this.setter({ name: "Files", val: value }); }      
    },
    uploadList: {
      get() { return this.$store.state.p.uploadList; },
      set(value){ this.$store.commit("setProjectUploadList", value); }   
    },
    isEditableAttr(){
      return (target) => {
        switch(this.operation){
          case "create": {
            switch(target){
              case "page":
              case "ProjectId":
              case "DivisionName":
              case "ProjectEmail":
              case "Budget":
              case "Files":
              case "Members": return true;
              default: return false;
            }
          }
          case "update": {
            switch(target){
              //case "page":
              case "ProjectEmail":
              case "Budget":
              case "Files":
              case "Members": return true;
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
    async onClickAccountLink(accountId){
      this.$store.commit('setTmpProjectId', this.$store.state.c.auth.ProjectId);
      this.$store.commit('setTmpAccountId', accountId);
      this.$router.push({ path: "get-account.html" });
    },
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
          // check members
          messages = messages.concat(this.$refs["members"].validate());
          if(!messages.length){
            resolve();
          }else{
            reject(new Error(format(messages)));
          }
        });
      });
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
      const api = new ProjectApi();
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
        const [url] = await api.getProjectUrls(this.projectId, [filename], "READ");
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
  created(){
    // Return to the auth page when reloading
    if(this.id && !this.$store.getters.getProjectById(this.id)){
      this.$router.push({ path: "get-project.html" });
      return;
    }
    // Return to the auth page when query is empty
    if(this.isExist && !this.id){
      this.$router.push({ path: "get-project.html" });
      return;
    }
    // always clear upload list
    this.$store.commit("setProjectUploadList", []);
  }
}
</script>

<style>
.el-select {
  width: 30%
}
.attention {
  margin-left: 1.5em;
  font-size: 80%;
  color: red;
}
.form-item {
  padding: 0 16px;
}
</style>