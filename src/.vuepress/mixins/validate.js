// Common validate mixin
export default {
  methods: {
    validateAuthProjectId(id) {
      if(id === ""){
        return "プロジェクト名は必須です。";
      }
      if(!/^[a-zA-Z0-9][a-zA-Z0-9\-]{0,19}$/.test(id)){
        return "不正な形式です。プロジェクト名は半角英数字とハイフンで構成されます。";
      }
      return "";
    },
    validateAuthAccountId(id) {
      if(id === ""){
        return "クラウド環境IDは必須です。";
      }
      if(!/^[a-zA-Z0-9]{12}$/.test(id)){
        return "AWSアカウントのID(半角数字12桁)、もしくは問い合わせ番号(半角英数字12桁) が利用できます。";
      }
      return "";
    }
  }
}