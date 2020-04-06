import { firebaseApp } from '@/firebase/firebaseinit.js'
import { db } from '@/firebase/db.js'

export default {
  namespaced: true,

  state: {
    user: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_CONFIGURATION(state, configuration) {
      state.user.configuration = configuration
    },
    SET_CURRENCY_OPTION(state, currency) {
      state.user.configuration.options = currency
    }
  },

  actions: {
    setUserProfile({ commit }) {
      firebaseApp.auth().onAuthStateChanged((user) => {
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
    loadUserConfiguration({ state, commit }) {
      return db
        .collection('users')
        .doc(state.user.id)
        .collection('configuration')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            return querySnapshot.docs.map(function(doc) {
              commit('SET_CONFIGURATION', {
                id: doc.id,
                options: doc.data()
              })
            })
          } else {
            return db
              .collection('users')
              .doc(state.user.id)
              .collection('configuration')
              .add({ currency: 'dollar' })
              .then((doc) => {
                return commit('SET_CONFIGURATION', {
                  id: doc.id,
                  options: { currency: 'dollar' }
                })
              })
          }
        })
    },
    setUserCurrency({ state, commit }, currency) {
      return db
        .collection('users')
        .doc(state.user.id)
        .collection('configuration')
        .doc(state.user.configuration.id)
        .set({
          currency: currency
        })
        .then(() => {
          return commit('SET_CURRENCY_OPTION', { currency: currency })
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
