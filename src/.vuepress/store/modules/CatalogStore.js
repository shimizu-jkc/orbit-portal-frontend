// Initial state
const state = () => ({
  Catalogs: [
    {
      Name: "ユーザー管理＆認証",
      Type: "テンプレート",
      Genre: "API",
      Vender: "AWS",
      Version: "v0.9.7 β",
      Link: "items/user-management"
    },
    {
      Name: "負荷試験",
      Type: "ソースコード",
      Genre: "テスト",
      Vender: "AWS",
      Version: "v0.9.0 α",
      Link: "items/loadtest"
    }
  ]
});

// Getters
const getters = {
  searchCatalog: (state) => ({keyword}) => {
    return state.Catalogs.filter(catalog => {
      return keyword.length ? catalog.Name.toLowerCase().includes(keyword.toLowerCase()) : true;
    });
  }
};

// Actions
const actions = {};

// Mutations
const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
}