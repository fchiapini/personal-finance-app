import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import firebase from 'firebase/app';
import { firebaseConfig } from './helpers/firebaseConfig.js';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

let app = '';
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});
