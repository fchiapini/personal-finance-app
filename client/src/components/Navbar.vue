<template>
  <v-app-bar v-if="user.user" app color="primary" dark>
    <v-toolbar-title>My personal finance</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-navigation-drawer color="primary" absolute permanent right>
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="user.user.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.user.name }}</v-list-item-title>
            <a @click="logout">
              <v-list-item-subtitle>Log out</v-list-item-subtitle>
            </a>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['user'])
  },
  methods: {
    logout: function() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.logo
  width: 70px
  height: 70px
  border-radius: 50%
</style>
