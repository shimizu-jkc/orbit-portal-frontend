// Initial state
const state = () => ({
  accountName: "",
  accountEmail: "",
  roles: [{
    email: "",
    role: "Guest"
  }]
})

// Getters
const getters = {}

// Actons
const actions = {}

// Mutations
const mutations = {
  setAccountName(state, val){
    state.accountName = val;
  },
  setAccountEmail(state, val){
    state.accountEmail = val;
  },
  setMemberRoleInfo(state, prop){
    switch(prop.type){
      case "email": state.members[prop.index].email = prop.value; break;
      case "role": state.members[prop.index].role = prop.value; break;
      default: console.error("undfined property"); break;
    }
  },
  addMemberRole(state){
    state.members.push({
      email: "",
      role: "Guest"
    });
  },
  deleteMemberRole(state, index){
    state.roles.splice(index, 1);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}