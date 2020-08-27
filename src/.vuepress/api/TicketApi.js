import ApiBase from "./ApiBase";

export default class TicketApi extends ApiBase {

  constructor(projectId, accountId){
    super("管理者作業");
    this.pid = projectId || "";
    this.aid = accountId || "";
  }

  async createTicket(param){
    let body = {};
    ["TicketEmail", "Type", "Content"].forEach(a => {
      if(param[a]){
        if(a==="Content"){
          body[a] = param[a][param.Type];
        }else{
          body[a] = param[a];
        }       
      }
    });
    return await super.post(`/projects/${this.pid}/accounts/${this.aid}/tickets`, body);
  }

  async getTickets(){
    return await super.get(`/projects/${this.pid}/accounts/${this.aid}/tickets`);
  }

  async getTicket(id){
    return await super.get(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`);
  }

  async updateTicket(id, param){
    let body = {};
    ["TicketEmail", "Type", "Content"].forEach(a => {
      if(param[a]){
        body[a] = param[a];
      }
    });
    if(!id || id.length == 0 || Object.keys(body).length == 0){
      console.error(id, body);
      throw new Error("不正なパラメータが含まれています。")
    }
    return await super.put(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`, body);
  }

  async deleteTicket(id){
    throw new Error("サポートしていないAPIです。")
    //return await super.delete(`/projects/${this.pid}/accounts/${this.aid}/tickets/${id}`);
  }
};