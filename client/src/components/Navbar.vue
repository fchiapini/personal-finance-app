<template>
  <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>My personal finance</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn icon>
          Home
        </v-btn>
      </router-link>
      <router-link to="/about">
        <v-btn icon>
          About
        </v-btn>
      </router-link>
  </v-app-bar>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>