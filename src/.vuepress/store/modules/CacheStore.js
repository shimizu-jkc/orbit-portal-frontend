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
const getters = {
  needProjectAuth: (state) => () => {
    return (state.auth.ProjectId.length === 0) || (state.tmp.ProjectId !== state.auth.ProjectId);
  },
  needAccountAuth: (state) => () => {
    return (state.auth.AccountId.length === 0) || (state.tmp.AccountId !== state.auth.AccountId);
  }
};

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
  },
  clearProjectCache(state){
    state.tmp.ProjectId = "";
    state.auth.ProjectId = "";
  },
  clearAccountCache(state){
    state.tmp.AccountId = "";
    state.auth.AccountId = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}