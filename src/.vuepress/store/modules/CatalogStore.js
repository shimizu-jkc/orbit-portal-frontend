const LIST = require("../../../knowledge/list");

// Initial state
const state = () => ({
  Knowledges: [...LIST]
});

// Getters
const getters = {
  searchKnowledge: (state) => ({keyword}) => {
    return state.Knowledges.filter(knowledge => {
      return keyword.length ? knowledge.Name.toLowerCase().includes(keyword.toLowerCase()) : true;
    });
  },
  getKnowledgeById: (state) => (id) => {
    console.log(state.Knowledges)
    console.log(id)
    console.log( state.Knowledges.find(k => k.Id === id))
    return state.Knowledges.find(k => k.Id === id);
  }
};

// Actions
const actions = {};

// Mutations
const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
}