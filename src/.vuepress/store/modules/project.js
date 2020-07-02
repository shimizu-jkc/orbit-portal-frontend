import api from '../../api/ProjectAPI'

// Initial state
const state = () => ({
  projectName: "",
  projectEmail: "",
  division: "",
  budget: 0,
  members: [
    {
      department: "",
      name: "",
      email: ""
    }
  ],
  result: {}
});

// Getters
const getters = {};

// Actons
const actions = {
  async getProject(context) {
    const result = await api.get();
    context.commit("setResult", result);
  },
  async createProject(context) {
    const result = await api.post(context);
    context.commit("setResult", result);
  }
};

// Mutations
const mutations = {
  setProjectName(state, val){
    state.projectName = val;
  },
  setProjectEmail(state, val){
    state.projectEmail = val;
  },
  setDivision(state, val){
    state.division = val;
  },
  setBudget (state, val){
    state.budget = val;
  },
  setMemberInfo (state, prop){
    switch(prop.type){
      case "department": state.members[prop.index].department = prop.value; break;
      case "name": state.members[prop.index].name = prop.value; break;
      case "email": state.members[prop.index].email = prop.value; break;
      default: console.error("undfined property"); break;
    }
    console.log(prop);
  },
  addMember(state){
    state.members.push({
      department: "",
      name: "",
      email: ""
    });
  },
  deleteMember(state, index){
    state.members.splice(index, 1);
  },
  setResult(state, val){
    state.result = val;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}