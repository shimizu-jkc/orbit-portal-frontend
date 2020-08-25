import ApiBase from "./ApiBase";

export default class AccountApi extends ApiBase {

  constructor(projectId){
    super("クラウド環境");
    this.pid = projectId || "";
  }

  async createAccount(param){
    if(param.MemberRoles){
      param.MemberRoles.forEach(m => {
        delete m.added; //remove original attribute
      });
    };
    return await super.post(`/projects/${this.pid}/accounts`, param);
  }

  async getAccount(id){
    return await super.get(`/projects/${this.pid}/accounts/${id}`);
  }

  async updateAccount(id, param){
    let body = {};
    ["BillingOWDepartmentCode", 
     "BillingOWUsageCode", 
     "BillingProjectCode", 
     "BillingProjectSubCode",
     "StartOperationDate",
     "ExpireOperationDate", 
     "MemberRoles"
    ].forEach(a => {
      if(param[a]){
        if(a === "MemberRoles"){
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
    return await super.put(`/projects/${this.pid}/accounts/${id}`, body);
  }

  async deleteAccount(id){
    return await super.delete(`/projects/${this.pid}/accounts/${id}`);
  }
};