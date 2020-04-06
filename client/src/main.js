import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueCurrencyFilter from 'vue-currency-filter'
import { CURRENCY_OPTIONS } from './plugins/vuecurrencyfilter'
import { firebaseApp } from './firebase/firebaseinit.js'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueCurrencyFilter, CURRENCY_OPTIONS['yen'])

let app = ''
firebaseApp.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      store,
      render: (h) => h(App)
    }).$mount('#app')
  }
})
