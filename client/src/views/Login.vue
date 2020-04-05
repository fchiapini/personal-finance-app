<template>
  <div class="container-login">
    <img src="../assets/logo_login2.png" class="login__logo" />
    <p class="login__title">Sign In</p>
    <div id="firebaseui-auth-container"></div>
    <router-link class="login__signup-link" to="/sign-up">
      Do not have an account?
    </router-link>
    <img src="../assets/login2.png" class="login__image" />
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
img
  display: block
  max-width: 100%

.container-login
  margin: 0.5em 0.5em 0 0.5em
  background: white
  border: 1px solid #c7c7c7
  max-width: 800px
  padding: 2em
  text-align: center

.login__title
  color: #4C4C4C
  font-weight: 400
  font-size: 24px

.login__title::after
  content: ''
  display: block
  width: 3em
  height: 1px
  margin: 0.5em auto 0
  background: #4C4C4C
  opacity: 0.8

.login__image,
.login__logo
  margin: 0 auto

.login__logo
  height: 150px
  width: 150px

@media (min-width: 800px)
  .container-login
    margin: 0 auto
    margin-top: 10%
    display: grid
    grid-template-columns: 400px 1fr
    grid-template-areas: 'img logo' 'img title' 'img firebase-btns' 'signup-link firebase-btns'

    .login__image
      grid-area: img
      justify-self: center

    .login__title
      grid-area: title

    .login__logo
      grid-area: logo
      grid-row: 1

    .firebaseui-auth-container
      grid-area: firebase-btns

    .login__signup-link
      grid-area: signup-link
      justify-self: center
      align-self: end
</style>
