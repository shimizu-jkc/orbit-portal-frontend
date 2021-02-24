import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from 'vuex-persistedstate';
import ProjectStore from './modules/ProjectStore'
import AccountStore from './modules/AccountStore'
import TicketStore from './modules/TicketStore'
import CacheStore from './modules/CacheStore'
import CatalogStore from './modules/CatalogStore'

Vue.use(Vuex);

export default (isServer) => {
  return new Vuex.Store({
    modules: {
      p: ProjectStore,
      a: AccountStore,
      t: TicketStore,
      c: CacheStore,
      x: CatalogStore
    },
    strict: process.env.NODE_ENV !== 'production',
    // only client side
    plugins: isServer ? [] : [
      PersistedState({
        key: 'OrbitPortal',
        paths: ['p.createParams', 'p.updateParams',
                'a.createParams', 'a.updateParams',
                't.createParams', 't.updateParams',
                'c.authPersistent'],
        storage: window.sessionStorage
      }),
      PersistedState({
        key: 'OrbitPortal',
        paths: ['c.tmp'],
        storage: window.localStorage
      })]
  });
}