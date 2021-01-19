import AccountApi from '../../api/AccountApi'

// parameter schema
const schema = {
  Env: "",
  BillingOWDepartmentCode: "0000000", //for test
  BillingOWUsageCode: "11111-2222", //for test
  BillingProjectCode: "",
  BillingProjectSubCode: "",
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
  createParams: { ...schema },
  updateParams: {},
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
    return (JSON.stringify(state.updateParams) !== JSON.stringify(getters.getAccountById(id))) || false;
  }
};

// Actions
const actions = {
  async reqCreateAccount({commit, state}, {projectId}) {
    const result = await (new AccountApi(projectId)).createAccount(state.createParams);
    commit("setAccountResult", result);
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
    state.createParams = { ...schema };
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}