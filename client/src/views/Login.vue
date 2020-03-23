<template>
  <div class="container-login">
    <img src="../assets/logo_login.png" class="logo" />
    <h1>Login</h1>
    <hr />
    <div id="firebaseui-auth-container"></div>
    <span>
      <router-link class="link-to-signup" to="/sign-up">
        Do not have an account?
      </router-link>
    </span>
  </div>
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

<style scoped lang="sass">
.container-login
  display: flex
  flex-direction: column
  width: 400px
  height: 420px
  top: 5%
  left: 50%
  background: #1976d2
  position: absolute
  transform: translate(-50%, 50%)
  align-items: center
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.25)

.logo
  width: 150px
  height: 150px
  border-radius: 50%
  margin-top: 30px
  margin-bottom: 10px
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.25)

.link-to-signup
  color: white

h1
  margin: 0
  color: white

hr
  border: 0.10em solid white
  border-radius: 5px
  width: 20em
</style>
