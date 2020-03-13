import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueCurrencyFilter from 'vue-currency-filter'
import { CURRENCY_OPTIONS } from './plugins/vuecurrencyfilter'
import { firebaseApp } from './firebase/firebaseinit.js'

Vue.config.productionTip = false

Vue.use(VueCurrencyFilter, CURRENCY_OPTIONS['yen'])

let app = ''
firebaseApp.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
