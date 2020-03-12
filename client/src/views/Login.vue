<template>
  <section>
    <section id="firebaseui-auth-container"></section>
    <p>
      Do not have an account?
      <router-link to="/sign-up">Sign up here!</router-link>
    </p>
  </section>
</template>

<script>
import {
  firebaseApp,
  GOOGLE_AUTH_PROVIDER_ID,
  EMAIL_AUTH_PROVIDER_ID
} from '../firebase/firebaseinit.js'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  name: 'Login',

  data: () => ({
    ui: null
  }),

  mounted() {
    this.ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseApp.auth())
    const uiConfig = {
      signInSuccessUrl: '/home', // This redirect can be achived by route using callback.
      signInFlow: 'popup',
      signInOptions: [GOOGLE_AUTH_PROVIDER_ID, EMAIL_AUTH_PROVIDER_ID]
    }
    this.ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

<style scoped></style>
