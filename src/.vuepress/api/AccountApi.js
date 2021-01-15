import ApiBase from "./ApiBase";

export default class AccountApi extends ApiBase {

  constructor(projectId){
    super("クラウド環境");
    this.pid = projectId || "";
  }

  async createAccount(param){
    return await super.post(`/projects/${this.pid}/accounts`, this._formatParam(param, true));
  }

  async getAccount(id){
    return await super.get(`/projects/${this.pid}/accounts/${id}`);
  }

  async updateAccount(id, param){
    return await super.put(`/projects/${this.pid}/accounts/${id}`, this._formatParam(param));
  }

  async updateAccountFiles(id, param){
    return await super.put(`/projects/${this.pid}/accounts/${id}/files`, this._formatParam(param));
  }

  async deleteAccount(id){
    return await super.delete(`/projects/${this.pid}/accounts/${id}`);
  }

  async getAccountUrls(id, names, action){
    return await super.getUrls(`/projects/${this.pid}/accounts/${id}/files/url`, names, action);
  }
 
  _formatParam(param, isCreate=false){
    const createOnly = isCreate ? ["Env"] : [];
    const editable =  ["Files", "BillingOWDepartmentCode", "BillingOWUsageCode", "BillingProjectCode", "BillingProjectSubCode",
                       "StartOperationDate", "ExpireOperationDate", "MemberRoles"];
    let body = {};

    editable.concat(createOnly).forEach(a => {
      if(param.hasOwnProperty(a)){
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
    if(Object.keys(body).length === 0){
      console.error(id, body);
      throw new Error("パラメータが存在しません。")
    }
    return body;
  }
};