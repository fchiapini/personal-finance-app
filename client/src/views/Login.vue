<template>
  <div class="container-login">
    <img src="../assets/logo.png" class="logo" />
    <h2>Login</h2>
    <div id="firebaseui-auth-container"></div>
    <span>
      <router-link to="/sign-up">Do not have an account?</router-link>
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
  border: solid
  border-color: #b3d4fc
  top: 5%
  left: 50%
  position: absolute
  transform: translate(-50%, 50%)
  box-sizing: border-box
  align-items: center
  justify-content: center

.logo
  width: 150px
  height: 150px
  border-radius: 50%
  margin-bottom: 30px

.h1
  margin: 0
  padding: 0 0 20px
  text-align: center
  font-size: 22px
</style>
