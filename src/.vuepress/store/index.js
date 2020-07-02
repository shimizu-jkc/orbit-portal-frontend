import Vue from 'vue'
import Vuex from 'vuex'
import project from './modules/project'
import account from './modules/account'
import ticket from './modules/ticket'
import cache from './modules/cache'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    p: project,
    a: account,
    ticket: ticket,
    c: cache
  },
  strict: process.env.NODE_ENV !== 'production'
});