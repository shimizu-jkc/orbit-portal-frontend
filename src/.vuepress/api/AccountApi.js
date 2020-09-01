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

  async deleteAccount(id){
    return await super.delete(`/projects/${this.pid}/accounts/${id}`);
  }

  _formatParam(param, isCreate=false){
    const createOnly = isCreate ? ["Env"] : [];
    const editable =  ["BillingOWDepartmentCode", "BillingOWUsageCode", "BillingProjectCode",
                       "StartOperationDate", "ExpireOperationDate", "MemberRoles"];
    let body = {};

    editable.concat(createOnly).forEach(a => {
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
    if(Object.keys(body).length === 0){
      console.error(id, body);
      throw new Error("パラメータが存在しません。")
    }
    return body;
  }
};