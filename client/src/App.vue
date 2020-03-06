<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <Budget></Budget>
    </v-content>
  </v-app>
</template>

<script>
import Budget from './components/Budget';

export default {
  name: 'App',

  components: {
    Budget
  },

  data: () => ({
    //
  }),
};
</script>
