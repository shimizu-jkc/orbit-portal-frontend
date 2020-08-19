import axios from "axios";
import env from "../env.json";

export default class ApiBase {
  constructor(dispName=""){
    this.dispName = dispName;
    this.axios = axios.create({
      baseURL: env.BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.API_KEY,
        "Authorization": "Bearer " + this._getToken()
      },
      responseType: "json"
    });
  }

  async get(resource){
    try{
      const result = await this.axios.get(resource);
      return result.data;
    }catch(e){
      throw this._createErrorMessage(e);
    }
  }

  async post(resource, body){
    try{
      const result = await this.axios.post(resource, body);
      return result.data;
    }catch(e){
      throw this._createErrorMessage(e);
    }
  }

  async put(resource, body){
    try{
      const result = await this.axios.put(resource, body);
      return result.data;
    }catch(e){
      throw this._createErrorMessage(e);
    }
  }

  async delete(resource){
    try{
      const result = await this.axios.delete(resource);
      return result.data;
    }catch(e){
      throw this._createErrorMessage(e);
    }
  }

  //Private method
  _getToken(){
    try{
      return document.cookie.split('; ').find(c => c.startsWith('TOKEN')).split('=')[1];
    }catch(e){
      console.error(e);
      throw new Error("認証トークンが設定されていません。");
    }
  }

  _createErrorMessage(error){
    let msg = "処理に失敗しました。";

    if(error.response && error.response.data && error.response.data.error_code){
      console.error(error.response);
      switch(error.response.data.error_code){
        case "ClientError"          : msg = `クライアントエラー`; break;
        case "BadRequest"           : msg = `不正なリクエストです。`; break;
        case "InvalidParam"         : msg = `不正なパラメータが含まれています。`; break;
        case "EmptyParam"           : msg = `空のパラメータが含まれています`; break;
        case "InvalidFormat"        : msg = `パラメータのフォーマットが不正です。`; break;
        case "InvalidRange"         : msg = `範囲外のパラメータが含まれています。`; break;
        case "NotSupported"         : msg = `サポートしていないパラメータが含まれています。`; break;
        case "Unauthorized"         : msg = `認証に失敗しました。`; break;
        case "AccessBlocked"        : msg = `アクセスが禁止されています。`; break;
        case "AccessDenied"         : 
        case "Forbidden"            : msg = `${this.dispName}にアクセスする権限がありません。`; break;
        case "NotVerified"          : msg = `不正なAPIキーです。`; break;
        case "RequestExpired"       : msg = `リクエストの有効期限が切れています。`; break;
        case "TokenExpired"         : msg = `認証トークンの有効期限が切れています。`; break;
        case "NotFound"             : 
        case "NoSuchUser"           : 
        case "NoSuchFile"           : 
        case "NoSuchResource"       : msg = `${this.dispName}が見つかりません。`; break;
        case "MethodNotAllowed"     : msg = `許可されていないメソッドです。`; break;
        case "AlreadyExist"         : msg = `${this.dispName}は既に存在しています。`; break;
        case "RequestTooLarge"      : msg = `リクエストのサイズが超過しています。`; break;
        case "UnsupportedMediaType" : msg = `サポートしていないメディア種別です。`; break;
        case "RateExceed"           : 
        case "Throttling"           : 
        case "TooManyRequest"       : msg = `一時的に利用が制限されています。しばらくお待ちください。`; break;
        case "SystemError"          : 
        case "StorageError"         : 
        case "DatabaseError"        : 
        case "NetworkError"         : 
        case "ConfigurationError"   : msg = `サーバーエラーが発生しました。`; break;
        case "BadGateway"           : msg = `サーバーにアクセスできませんでした。`; break;
        case "ServiceUnavailable"   : msg = `現在利用できません。`; break;
        case "RequestTimeout"       : msg = `リクエストがタイムアウトしました。`; break;
        default: console.error(`Unknown error response. code = ${error.response.data.error_code}`); break;
      }
    }else if(error.request){
      console.error(error.request);
    }else{
      console.error('Error', error.message);
    }
    return new Error(msg);
  }
};