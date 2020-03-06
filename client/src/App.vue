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
      <Income></Income>
      <Expense></Expense>
    </v-content>
  </v-app>
</template>

<script>
import Income from './components/Income';
import Expense from './components/Expense';

export default {
  name: 'App',

  components: {
    Income,
    Expense
  },

  data: () => ({
    //
  }),
};
</script>
