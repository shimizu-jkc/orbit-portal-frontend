import Vue from 'vue'
import Vuex from 'vuex'
import ProjectStore from './modules/ProjectStore'
import AccountStore from './modules/AccountStore'
import TicketStore from './modules/TicketStore'
import CacheStore from './modules/CacheStore'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    p: ProjectStore,
    a: AccountStore,
    t: TicketStore,
    c: CacheStore
  },
  strict: process.env.NODE_ENV !== 'production'
});