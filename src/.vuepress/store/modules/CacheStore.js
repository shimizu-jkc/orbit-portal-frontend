// Initial state
const state = () => ({
  tmp: {
    ProjectId: "Orbit",
    AccountId: "g10ebtcyejef"
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
    state.tmp.ProjectId = val ? val : "";
  },
  setTmpAccountId(state, val){
    state.tmp.AccountId = val ? val : "";
  },
  setAuthProjectId(state, val){
    state.auth.ProjectId = val ? val : "";
  },
  setAuthAccountId(state, val){
    state.auth.AccountId = val ? val : "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}