import TicketApi from '../../api/TicketApi'

// Initial state
const state = () => ({
  createParams: {
    TicketEmail: "",
    Type: "",
    Content: {
      REQ_CF_KEYPAIR: {},
      REQ_AUDIT_LOG: {},
      REQ_SUPPORT_PLAN_CHANGE: {},
      REQ_OTHER: {}
    }
  },
  updateParams: {},
  results: []
});

// Getters
const getters = {
  getDummyTicket: (state) => () => {
    return  {
      TicketId: "",
    };
  },
  getTicketById: (state) => (id) => {
    return state.results.find(r => r.TicketId === id);
  },
  isTicketEdited: (state) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(state.results.find(r => r.TicketId === id)));
  }
};

// Actions
const actions = {
  async reqCreateTicket({commit, state}, {projectId, accountId}) {
    const result = await (new TicketApi(projectId, accountId)).createTicket(state.createParams);
    commit("setTicketResult", result);
  },
  async reqGetTickets({commit}, {id, projectId, accountId}) {
    const result = await (new TicketApi(projectId, accountId)).getTickets();
    commit("setTicketResults", result);
  },
  async reqGetTicket({commit}, {id, projectId, accountId}) {
    const result = await (new TicketApi(projectId, accountId)).getTicket(id);
    commit("setTicketResult", result);
  },
  async reqUpdateTicket({commit, state, getters}, {id}) {
    const ticket = getters.getTicketById(id);
    const result = await (new TicketApi(ticket.OwnerProjectId, ticket.OwnerAccountId)).updateTicket(id, state.updateParams);
    commit("setTicketResult", result);
  }
};

// Mutations
const mutations = {
  setTicketCreateParams(state, param){
    switch(param.name){
      case "Content" : state.createParams.Content[param.type][param.name] = param.val; break;
      default        : state.createParams[param.name] = param.val;
    }
  },
  loadDefaultTicketUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.TicketId === id) || {}));
  },
  setTicketUpdateParams(state, param){
    switch(param.name){
      case "Content" : state.updateParams.Content[param.type][param.name] = param.val; break;
      default        : state.updateParams[param.name] = param.val;
    }
  },
  setTicketResults(state, val){
    state.results = val ? val : [];
  },
  setTicketResult(state, val){
    const index = state.results.findIndex(r => r.TicketId === val.TicketId);
    if (index != -1) {
      state.results.splice(index, 1, val);
    } else {
      console.error(`${val.TicketId} is not found.`);
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