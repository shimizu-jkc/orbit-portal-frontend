import AccountApi from '../../api/AccountApi'

// Initial state
const state = () => ({
  createParams: {
    Env: "",
    BillingOWDepartmentCode: "",
    BillingOWUsageCode: "",
    BillingProjectCode: "",
    BillingProjectSubCode: "",
    StartOperationDate: "",
    ExpireOperationDate: "",
    MemberRoles: [
      {
        Email: "",
        Name: "",
        Role: "",
        added: false
      }
    ]
  },
  updateParams: {},
  results: []
});

// Getters
const getters = {
  getDummyAccount: (state) => () => {
    return  {
      AccountId: "",
      MemberRoles: []
    };
  },
  getAccountById: (state) => (id) => {
    return state.results.find(r => r.AccountId === id);
  },
  isAccountEdited: (state) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(state.results.find(r => r.AccountId === id)));
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
    const projectId = getters.getAccountById(id).OwnerProjectId;
    const result = await (new AccountApi(projectId)).updateAccount(id, state.updateParams);
    commit("setAccountResult", result);
  },
  async reqDeleteAccount({commit, getters}, {id}) {
    const projectId = getters.getAccountById(id).OwnerProjectId;
    await (new AccountApi(projectId)).deleteAccount(id);
    commit("setAccountResult", null);
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
  loadDefaultAccountUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.AccountId === id)||{}));
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
  setAccountResult(state, val){
    if(val){
      state.results[0] = val; //Not fix
    }else{
      state.results = [];
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}