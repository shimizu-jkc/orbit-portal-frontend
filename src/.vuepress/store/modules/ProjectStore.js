import ProjectApi from '../../api/ProjectApi'

// Initial state
const state = () => ({
  createParams: {
    ProjectId: "",
    ProjectEmail: "",
    DivisionName: "",
    Budget: 0,
    Members: [
      {
        Department: "",
        Name: "",
        Email: "",
        Admin: false,
        added: false
      }
    ]
  },
  updateParams: {},
  results: [],
  currentOwnerProjectId: ""
});

// Getters
const getters = {
  getDummyProject: (state) => () => {
    return  {
      ProjectId: "",
      ProjectEmail: "",
      DivisionName: "",
      Budget: 0,
      Members: []
    };
  },
  getProjectById: (state) => (id) => {
    return state.results.find(r => r.ProjectId === id);
  },
  isEdited: (state, getters) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(getters.getProjectById(id)));
  }
};

// Actions
const actions = {
  async reqCreateProject({commit, state}) {
    const result = await (new ProjectApi()).createProject(state.createParams);
    commit("setResult", result);
  },
  async reqGetProject({commit}, {id}) {
    const result = await (new ProjectApi()).getProject(id);
    commit("setResult", result);
  },
  async reqUpdateProject({commit, state}, {id}) {
    const result = await (new ProjectApi()).updateProject(id, state.updateParams);
    commit("setResult", result);
  },
  async reqDeleteProject({commit}, {id}) {
    await (new ProjectApi()).deleteProject(id);
    commit("setResult", null);
  }
};

// Mutations
const mutations = {
  setCreateParams(state, param){
    switch(param.name){
      case "Member::Department" : state.createParams.Members[param.index].Department = param.val; break;
      case "Member::Name"       : state.createParams.Members[param.index].Name = param.val; break;
      case "Member::Email"      : state.createParams.Members[param.index].Email = param.val; break;
      case "Member::Admin"      : state.createParams.Members[param.index].Admin = param.val; break;
      case "Member::ADD"        : state.createParams.Members.push({Department: "", Name: "", Email: "", Admin: false, added: true}); break;
      case "Member::DELETE"     : state.createParams.Members.splice(param.index, 1); break;
      default                   : state.createParams[param.name] = param.val;
    }
  },
  loadDefaultUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.ProjectId === id)||{}));
  },
  setUpdateParams(state, param){
    switch(param.name){
      case "Member::Department" : state.updateParams.Members[param.index].Department = param.val; break;
      case "Member::Name"       : state.updateParams.Members[param.index].Name = param.val; break;
      case "Member::Email"      : state.updateParams.Members[param.index].Email = param.val; break;
      case "Member::Admin"      : state.updateParams.Members[param.index].Admin = param.val; break;
      case "Member::ADD"        : state.updateParams.Members.push({Department: "", Name: "", Email: "", Admin: false, added: true}); break;
      case "Member::DELETE"     : state.updateParams.Members.splice(param.index, 1); break;
      default                   : state.updateParams[param.name] = param.val;
    }
  },
  setResult(state, val){
    if(val){
      state.results[0] = val; //Not fix
    }else{
      state.results = [];
    }
  },
  setCurrentOwnerProjectId(state, val){
    state.currentOwnerProjectId = val;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}