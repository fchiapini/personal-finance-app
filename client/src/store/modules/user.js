import { firebaseApp } from '@/firebase/firebaseinit.js'

export default {
  namespaced: true,
  state: {
    user: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },

  actions: {
    setUserProfile({ commit }) {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) {
          commit('SET_USER', {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL
          })
        }
      })
    },
    logout({ commit }) {
      return firebaseApp
        .auth()
        .signOut()
        .then(() => {
          commit('SET_USER', null)
        })
    }
  }
}
