import ProjectApi from '../../api/ProjectApi';

// parameter schema
const schema = {
  ProjectId: "",
  ProjectEmail: "",
  DivisionName: "",
  Budget: 0,
  Files: [],
  Members: [
    {
      Department: "",
      Name: "",
      Email: "",
      Admin: false,
      added: false
    }
  ]
};

// Initial state
const state = () => ({
  createParams: JSON.parse(JSON.stringify(schema)),
  updateParams: {},
  uploadList: [],
  results: [],
  result: {}
});

// Getters
const getters = {
  getDummyProject: (state) => () => {
    return {
      ProjectId: "",
      Members: []
    };
  },
  getProjectById: (state, getters) => (id) => {
    return state.results.find(r => r.ProjectId === id);
  },
  getProjectResult: (state) => () => {
    return state.result;
  },
  isProjectEdited: (state, getters) => (id) => {
    return (JSON.stringify(state.updateParams) !== JSON.stringify(getters.getProjectById(id)))
      || (state.uploadList.length !== 0);
  },
  isExistProjectUpdateCache: (state, getters) => (id) => {
    return (id === state.updateParams.ProjectId) && getters.isProjectEdited(id);
  },
  isExistUploadProjectFiles: (state) => () => {
    return state.uploadList.length > 0;
  }
};

// Actions
const actions = {
  async reqCreateProject({commit, state}) {
    const result = await (new ProjectApi()).createProject(state.createParams);
    commit("setProjectResult", result);
    return result.ProjectId;
  },
  async reqGetProject({commit, getters}, {id}) {
    const result = await (new ProjectApi()).getProject(id);
    commit("setProjectResult", result);
  },
  async reqUpdateProject({commit, state}, {id}) {
    const result = await (new ProjectApi()).updateProject(id, state.updateParams);
    commit("setProjectResult", result);
  },
  async reqDeleteProject({commit}, {id}) {
    await (new ProjectApi()).deleteProject(id);
    commit("clearProjectResult", id);
    commit("clearProjectCache");
  },
  async reqUpdateProjectFiles({commit, state, getters}, {id}) {
    const result = await (new ProjectApi()).updateProjectFiles(id, {
      Files: state.uploadList.map(f => f.name)
    });
    commit("setProjectFilesResult", {id, files: result.Files || []});
  },
  async reqUploadProjectFiles({commit, state, getters}, {id, isCreate}) {
    if(state.uploadList.length) {
      const api = new ProjectApi();
      const names = state.uploadList.map(f => f.name);
      const blobs = state.uploadList.map(f => f.raw);
      const urls = await api.getProjectUrls(id, names, "WRITE");
      await Promise.all(names.map(async(n, i) => {
        await api.upload(urls[i], blobs[i]);
      }));
      if(!isCreate){
        // apply merge
        commit("mergeProjectFiles");
        commit("setProjectUploadList", []);
      }
      return true;
    }
    return false;
  }
};

// Mutations
const mutations = {
  setProjectCreateParams(state, param){
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
  setProjectUpdateParams(state, param){
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
  loadDefaultUpdateParams(state, id){
    state.updateParams = JSON.parse(JSON.stringify(state.results.find(r => r.ProjectId === id) || {}));
  },
  setProjectResult(state, val){
    const index = state.results.findIndex(r => r.ProjectId === val.ProjectId);
    if(index != -1){
      //update
      state.results.splice(index, 1, val);
    }else{
      //create
      state.results.push(val);
    }
    state.result = val;
  },
  clearProjectResult(state, id){
    const index = state.results.findIndex(r => r.ProjectId === id);
    if(index != -1){
      state.results.splice(index, 1);
    }
    state.result = {};
  },
  clearProjectCreateParams(state){
    state.createParams = JSON.parse(JSON.stringify(schema));
  },
  clearProjectUpdateParams(state){
    state.updateParams = JSON.parse(JSON.stringify(schema));
  },
  setProjectFilesResult(state, {id, files}){
    const index = state.results.findIndex(r => r.ProjectId === id);
    if(index != -1){
      state.results[index].Files = files;
    }
    state.result.Files = files;
  },
  setProjectUploadList(state, val){
    state.uploadList = val;
  },
  mergeProjectFiles(state){
    const names = state.uploadList.map(f => f.name);
    // unique merge
    state.updateParams.Files = [...new Set(state.updateParams.Files.concat(names))];
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}