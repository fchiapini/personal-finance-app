<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form>
                <v-layout row>
                  <v-flex sx12>
                    <v-img class="logo" src="../assets/logo.png"></v-img>
                    <v-text-field
                      name="userEmail"
                      label="Email"
                      v-model="email"
                      type="email"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex sx12>
                    <v-text-field
                      name="password"
                      label="Password"
                      v-model="password"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex sx12>
                    <v-text-field
                      name="confirmPassword"
                      label="Confirm Password"
                      v-model="confirmPassword"
                      type="password"
                      :rules="[comparePasswords]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn @click="onSignUp">Sign up</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { firebaseApp } from '../firebase/firebaseinit.js'
export default {
  name: 'signUp',

  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },

  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? 'Password do not match'
        : ''
    }
  },

  methods: {
    onSignUp: function() {
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.replace('home')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        )
    }
  }
}
</script>

<style scoped lang="sass">
.logo
  width: 150px
  height: 150px
  border-radius: 50%
  margin-bottom: 30px
  margin: auto
</style>
