import ApiBase from "./ApiBase";

export default class ProjectApi extends ApiBase {

  constructor(){
    super("プロジェクト");
  }

  async createProject(param){
    if(param.Members){
      param.Members.forEach(m => {
        delete m.added; //remove original attribute
      });
    };
    return await super.post(`/projects`, param);
  }

  async getProject(id){
    return await super.get(`/projects/${id}`);
  }

  async updateProject(id, param){
    let body = {};
    ["ProjectEmail", "Budget", "Members"].forEach(a => {
      if(param[a]){
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
    if(!id || id.length == 0 || Object.keys(body).length == 0){
      console.error(id, body);
      throw new Error("不正なパラメータが含まれています。")
    }
    return await super.put(`/projects/${id}`, body);
  }

  async deleteProject(id){
    return await super.delete(`/projects/${id}`);
  }
};