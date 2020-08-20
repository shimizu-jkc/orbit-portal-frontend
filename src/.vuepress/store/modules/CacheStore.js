// Initial state
const state = () => ({
  authProjectName: "",
  authProjectEmail: "",
  authAccountId: ""
});

// Getters
const getters = {};

// Actons
const actions = {};

// Mutations
const mutations = {
  setAuthProjectName(state, val){
    state.authProjectName = val;
  },
  setAuthProjectEmail(state, val){
    state.authProjectEmail = val;
  },
  setAuthAccountId(state, val){
    state.authAccountId = val;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}