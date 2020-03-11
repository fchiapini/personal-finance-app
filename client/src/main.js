import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import { firebaseApp } from './firebase/firebaseinit.js';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

let app = '';

firebaseApp.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});
