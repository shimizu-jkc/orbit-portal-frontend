import ApiBase from "./ApiBase";

export default class TicketApi extends ApiBase {

  constructor(projectId, accountId){
    super("管理者作業");
    this.pid = projectId || "";
    this.aid = accountId || "";
  }

  async createTicket(param){
    return await super.post(`/projects/${this.pid}/accounts/${this.aid}/tickets`, this._formatParam(param));
  }

  async getTickets(){
    return await super.get(`/projects/${this.pid}/accounts/${this.aid}/tickets`);
  }

  async getTicket(id){
    return await super.get(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`);
  }

  async updateTicket(id, param){
    return await super.put(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`, this._formatParam(param));
  }

  async deleteTicket(id){
    throw new Error("サポートしていないAPIです。")
    //return await super.delete(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`);
  }

  _formatParam(param){
    let body = {};
    ["TicketEmail", "Type", "Content"].forEach(a => {
      if(param[a]){
        if(a === "Content"){
          body[a] = param[a][param.Type] || param[a];
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