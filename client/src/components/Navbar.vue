<template>
  <v-app-bar v-if="user" app color="primary" dark>
    <v-toolbar-title>My personal finance</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu bottom :offset-x="true" :offset-y="true">
      <template v-slot:activator="{ on }">
        <a v-on="on">
          <v-avatar size="36">
            <v-img :src="image" alt="User image"></v-img>
          </v-avatar>
        </a>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="image" alt="User image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ user.name ? user.name : user.email }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <a @click="logout">
              <v-icon>mdi-exit-to-app</v-icon>
              Log out
            </a>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('user', ['user']),
    image() {
      return this.user.image
        ? this.user.image
        : require('../assets/avatar_placeholder.png')
    }
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
