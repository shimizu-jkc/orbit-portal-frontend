import Vue from 'vue'
import Vuex from 'vuex'
import ProjectStore from './modules/ProjectStore'
import AccountStore from './modules/AccountStore'
import TicketStore from './modules/TicketStore'
import CacheStore from './modules/CacheStore'
import CatalogStore from './modules/CatalogStore'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    p: ProjectStore,
    a: AccountStore,
    t: TicketStore,
    c: CacheStore,
    x: CatalogStore
  },
  strict: process.env.NODE_ENV !== 'production'
});