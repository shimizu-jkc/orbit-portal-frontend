import AccountApi from '../../api/AccountApi'
import env from "../../env.json";

// parameter schema
const schema = {
  Env: "",
  BillingAFFCode: (env.ENV === "dev") ? "1000.100600.0000.OT001.000.6510210.000000.0000000000.0.0" : "",
  Files: [],
  StartOperationDate: 0,
  ExpireOperationDate: 0,
  MemberRoles: [
    {
      Email: "",
      Name: "",
      Role: "",
      added: false
    }
  ]
};

// Initial state
const state = () => ({
  createParams: JSON.parse(JSON.stringify(schema)),
  updateParams: {},
  uploadList: [],
  results: [],
  result: {}
});

// Getters
const getters = {
  getDummyAccount: (state) => () => {
    return  {
      AccountId: "",
      Status: "WAITING_CONFIRM",
      MemberRoles: []
    };
  },
  getAccountById: (state) => (id) => {
    return state.results.find(r => r.AccountId === id);
  },
  getAccountResult: (state) => () => {
    return state.result;
  },
  isAccountEdited: (state, getters) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(getters.getAccountById(id)))
      || (state.uploadList.length !== 0);
  },
  isExistAccountUpdateCache: (state, getters) => (id) => {
    return (id === state.updateParams.AccountId) && getters.isAccountEdited(id);
  },
  isExistUploadAccountFiles: (state) => () => {
    return state.uploadList.length > 0;
  }
};

// Actions
const actions = {
  async reqCreateAccount({commit, state}, {projectId}) {
    const result = await (new AccountApi(projectId)).createAccount(state.createParams);
    commit("setAccountResult", result);
    return result.AccountId;
  },
  async reqGetAccount({commit, getters}, {id, projectId}) {
    const result = await (new AccountApi(projectId)).getAccount(id);
    commit("setAccountResult", result);
  },
  async reqUpdateAccount({commit, state, getters}, {id}) {
    const account = getters.getAccountById(id);
    const result = await (new AccountApi(account.OwnerProjectId)).updateAccount(id, state.updateParams);
    commit("setAccountResult", result);
  },
  async reqDeleteAccount({commit, getters}, {id}) {
    const account = getters.getAccountById(id);
    await (new AccountApi(account.OwnerProjectId)).deleteAccount(id);
    commit("clearAccountResult", id);
    commit("clearAccountCache");
  },
  async reqUpdateAccountFiles({commit, state, getters}, {id}) {
    const account = getters.getAccountById(id);
    const result = await (new AccountApi(account.OwnerProjectId)).updateAccountFiles(id, {
      Files: state.uploadList.map(f => f.name)
    });
    commit("setAccountFilesResult", {id, files: result.Files || []});
  },
  async reqUploadAccountFiles({commit, state, getters}, {id, isCreate}) {
    const account = getters.getAccountById(id);
    if(state.uploadList.length) {
      const api = new AccountApi(account.OwnerProjectId);
      const names = state.uploadList.map(f => f.name);
      const blobs = state.uploadList.map(f => f.raw);
      const urls = await api.getAccountUrls(id, names, "WRITE");
      await Promise.all(names.map(async(n, i) => {
        await api.upload(urls[i], blobs[i]);
      }));
      if(!isCreate){
        // apply merge
        commit("mergeAccountFiles");
        commit("setAccountUploadList", []);
      }
      return true;
    }
    return false;
  }
};

// Mutations
const mutations = {
  setAccountCreateParams(state, param){
    switch(param.name){
      case "MemberRole::Email"      : state.createParams.MemberRoles[param.index].Email = param.val; break;
      case "MemberRole::Name"       : state.createParams.MemberRoles[param.index].Name = param.val; break;
      case "MemberRole::Role"       : state.createParams.MemberRoles[param.index].Role = param.val; break;
      case "MemberRole::ADD"        : state.createParams.MemberRoles.push({Email: "", Name: "", Role: "", added: true}); break;
      case "MemberRole::DELETE"     : state.createParams.MemberRoles.splice(param.index, 1); break;
      default                       : state.createParams[param.name] = param.val;
    }
  },
  setAccountUpdateParams(state, param){
    switch(param.name){
      case "MemberRole::Email"      : state.updateParams.MemberRoles[param.index].Email = param.val; break;
      case "MemberRole::Name"       : state.updateParams.MemberRoles[param.index].Name = param.val; break;
      case "MemberRole::Role"       : state.updateParams.MemberRoles[param.index].Role = param.val; break;
      case "MemberRole::ADD"        : state.updateParams.MemberRoles.push({Email: "", Name: "", Role: "", added: true}); break;
      case "MemberRole::DELETE"     : state.updateParams.MemberRoles.splice(param.index, 1); break;
      default                       : state.updateParams[param.name] = param.val;
    }
  },
  loadDefaultAccountUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.AccountId === id)||{}));
  },
  setAccountResult(state, val){
    const index = state.results.findIndex(r => r.AccountId === val.AccountId);
    if(index != -1){
      //update
      state.results.splice(index, 1, val);
    }else{
      //create
      state.results.push(val);
    }
    state.result = val;
  },
  clearAccountResult(state, id){
    const index = state.results.findIndex(r => r.AccountId === id);
    if(index != -1){
      state.results.splice(index, 1);
    }
    state.result = {};
  },
  clearAccountCreateParams(state){
    state.createParams = JSON.parse(JSON.stringify(schema));
  },
  clearAccountUpdateParams(state){
    state.updateParams = JSON.parse(JSON.stringify(schema));
  },
  setAccountFilesResult(state, {id, files}){
    const index = state.results.findIndex(r => r.AccountId === id);
    if(index != -1){
      state.results[index].Files = files;
    }
    state.result.Files = files;
  },
  setAccountUploadList(state, val){
    state.uploadList = val;
  },
  mergeAccountFiles(state){
    const names = state.uploadList.map(f => f.name);
    // unique merge
    state.updateParams.Files = [...new Set(state.updateParams.Files.concat(names))];
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}