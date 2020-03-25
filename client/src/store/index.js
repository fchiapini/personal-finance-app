import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import user from '@/store/modules/user.js'
import budget from '@/store/modules/budget.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loader: false
  },
  mutations: {
    ...vuexfireMutations,
    SET_LOADER(state, load) {
      state.loader = load
    }
  },
  actions: {
    startLoading({ commit }) {
      commit('SET_LOADER', true)
    },
    stopLoading({ commit }) {
      commit('SET_LOADER', false)
    }
  },
  modules: {
    user,
    budget
  }
})
