<template>
  <div class="sign-up">
    <p>Let's create a new account !</p>
    <input type="text" v-model="email" placeholder="Email" /><br />
    <input type="password" v-model="password" placeholder="Password" /><br />
    <button @click="signUp">Sign Up</button>
    <span>or go back to <router-link to="/login">login</router-link>.</span>
  </div>
</template>

<script>
import { firebaseApp } from '../firebase/firebaseinit.js'
export default {
  name: 'signUp',

  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function() {
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.replace('home')
          },
          err => {
            alert('Oops. ' + err.message)
          }
        )
    }
  }
}
</script>

<style scoped></style>
