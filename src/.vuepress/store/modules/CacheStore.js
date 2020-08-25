// Initial state
const state = () => ({
  tmp: {
    ProjectId: "",
    AccountId: ""
  },
  auth: {
    ProjectId: "",
    AccountId: ""
  }
});

// Getters
const getters = {};

// Actons
const actions = {};

// Mutations
const mutations = {
  setTmpProjectId(state, val){
    state.tmp.ProjectId = val;
  },
  setTmpAccountId(state, val){
    state.tmp.AccountId = val;
  },
  setAuthProjectId(state, val){
    state.auth.ProjectId = val;
  },
  setAuthAccountId(state, val){
    state.auth.AccountId = val;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}