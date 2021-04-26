const LIST = require("../../../knowledge/list");

// Initial state
const state = () => ({
  Knowledges: [...LIST]
});

// Getters
const getters = {
  searchKnowledge: (state) => ({keyword, phases, types, envs}) => {
    return state.Knowledges.filter(knowledge => {
      if(phases && phases.length && !phases.includes(knowledge.Phase)) {
        return false;
      }
      if(types && types.length && !types.includes(knowledge.Type)) {
        return false;
      }
      if(envs && envs.length && !envs.includes(knowledge.Env)) {
        return false;
      }
      if(keyword.length) {
        const k = keyword.toLowerCase();
        if(!(knowledge.Name && knowledge.Name.toLowerCase().includes(k)) &&
           !(knowledge.Desc && knowledge.Desc.toLowerCase().includes(k)) &&
           !(knowledge.Author && knowledge.Author.toLowerCase().includes(k))) {
          return false;
        }
      }
      return true;
    });
  },
  getKnowledgeById: (state) => (id) => {
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