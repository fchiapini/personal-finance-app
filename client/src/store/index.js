import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import user from '@/store/modules/user.js'
import budget from '@/store/modules/budget.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {
    ...vuexfireMutations
  },
  actions: {},
  modules: {
    user,
    budget
  }
})
