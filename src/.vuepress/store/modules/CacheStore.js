import env from "../../env.json";

// Initial state
const state = () => ({
  tmp: {
    ProjectId: (env.ENV === "dev") ? "Orbit" : "",
    AccountId: (env.ENV === "dev") ? "259121556800" : ""
  },
  auth: {
    ProjectId: "",
    AccountId: ""
  },
  authPersistent: {
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
  },
  authPersistentProjectId: (state) => () => {
    return state.authPersistent.ProjectId;
  },
  authPersistentAccountId: (state) => () => {
    return state.authPersistent.AccountId;
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
    state.authPersistent.ProjectId = val ? val : "";
  },
  setAuthAccountId(state, val){
    state.auth.AccountId = val ? val : "";
    state.authPersistent.AccountId = val ? val : "";
  },
  clearProjectCache(state){
    state.tmp.ProjectId = "";
    state.auth.ProjectId = "";
    state.authPersistent.ProjectId = "";
  },
  clearAccountCache(state){
    state.tmp.AccountId = "";
    state.auth.AccountId = "";
    state.authPersistent.AccountId = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}