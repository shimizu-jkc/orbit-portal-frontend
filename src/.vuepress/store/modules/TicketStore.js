import TicketApi from '../../api/TicketApi'

// parameter schema
const schema = {
  TicketEmail: "",
  Type: "",
  Content: {
    REQ_CF_KEYPAIR: {
      Note: ""
    },
    REQ_AUDIT_LOG: {
      Service: "",
      StartDate: 0,
      EndDate: 0,
      Note: ""
    },
    REQ_SUPPORT_PLAN_CHANGE: {
      ExpectedPlan: "",
      Note: ""
    },
    REQ_OTHER: {
      Note: ""
    }
  }
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
  getDummyTicket: (state) => () => {
    return  {
      TicketId: "",
    };
  },
  getTicketById: (state) => (id) => {
    return state.results.find(r => r.TicketId === id);
  },
  getTicketResult: (state) => () => {
    return state.result;
  },
  getTicketList: (state) => () => {
    return state.results;
  },
  isTicketEdited: (state, getters) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(getters.getTicketById(id))) || false;
  },
  isTicketLoaded: (state, getters) => (id) => {
    return getters.getTicketById(id).Content ? true : false;
  },
  isTicketDeleted: (state, getters) => (id) => {
    const ticket = getters.getTicketById(id);
    return ticket && (ticket.Status === "CLOSED");
  },
  isExistTicketUpdateCache: (state, getters) => (id) => {
    return (id === state.updateParams.TicketId) && getters.isTicketEdited(id);
  }
};

// Actions
const actions = {
  async reqCreateTicket({commit, state}, {projectId, accountId}) {
    const result = await (new TicketApi(projectId, accountId)).createTicket(state.createParams);
    commit("setTicketResult", result);
  },
  async reqGetTickets({commit}, {projectId, accountId}) {
    const result = await (new TicketApi(projectId, accountId)).getTickets();
    commit("setTicketResults", result.Results);
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
      case "Content::Service"       : state.createParams.Content[param.type].Service = param.val; break;
      case "Content::StartDate"     : state.createParams.Content[param.type].StartDate = param.val; break;
      case "Content::EndDate"       : state.createParams.Content[param.type].EndDate = param.val; break;
      case "Content::ExpectedPlan"  : state.createParams.Content[param.type].ExpectedPlan = param.val; break;
      case "Content::Note"          : state.createParams.Content[param.type].Note = param.val; break;
      default                       : state.createParams[param.name] = param.val;
    }
  },
  setTicketUpdateParams(state, param){
    switch(param.name){
      case "Content::Service"       : state.updateParams.Content.Service = param.val; break;
      case "Content::StartDate"     : state.updateParams.Content.StartDate = param.val; break;
      case "Content::EndDate"       : state.updateParams.Content.EndDate = param.val; break;
      case "Content::ExpectedPlan"  : state.updateParams.Content.ExpectedPlan = param.val; break;
      case "Content::Note"          : state.updateParams.Content.Note = param.val; break;
      default                       : state.updateParams[param.name] = param.val;
    }
  },
  loadDefaultTicketUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.TicketId === id) || {}));
  },
  setTicketResults(state, val){
    state.results = val ? val : [];
  },
  setTicketResult(state, val){
    const index = state.results.findIndex(r => r.TicketId === val.TicketId);
    if(index != -1){
      //update
      state.results.splice(index, 1, val);
    }else{
      //create
      state.results.push(val);
    }
    state.result = val;
  },
  clearTicketResults(state){
    state.results = [];
    state.result = {};
  },
  clearTicketCreateParams(state){
    state.createParams = { ...schema };
  },
  clearTicketUpdateParams(state){
    state.updateParams = { ...schema };
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}