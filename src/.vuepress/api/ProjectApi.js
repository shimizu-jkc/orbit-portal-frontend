import ApiBase from "./ApiBase";

export default class ProjectApi extends ApiBase {

  constructor(){
    super("プロジェクト");
  }

  async createProject(param){
    return await super.post(`/projects`, this._formatParam(param, true));
  }

  async getProject(id){
    return await super.get(`/projects/${id}`);
  }

  async updateProject(id, param){
    return await super.put(`/projects/${id}`, this._formatParam(param));
  }

  async updateProjectFiles(id, param){
    return await super.put(`/projects/${id}/files`, this._formatParam(param));
  }

  async deleteProject(id){
    return await super.delete(`/projects/${id}`);
  }

  async getProjectUrls(id, names, action){
    return await super.getUrls(`/projects/${id}/files/url`, names, action);
  }

  _formatParam(param, isCreate=false){
    const createOnly = isCreate ? ["ProjectId", "DivisionName"] : [];
    const editable =  ["ProjectEmail", "Budget", "Files", "Members"];
    let body = {};

    editable.concat(createOnly).forEach(a => {
      if(param.hasOwnProperty(a)){
        if(a === "Members"){
          body[a] = param[a].map(m => {
            delete m.added; //remove original attribute
            return m;
          });
        }else{
          body[a] = param[a];
        }
      }
    });
    if(Object.keys(body).length === 0){
      console.error(id, body);
      throw new Error("パラメータが存在しません。")
    }
    return body;
  }
};