<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4" align-self="center">
        <v-img
          max-heigth="500"
          max-width="500"
          src="../assets/new_budget.png"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="6" md="4" align-self="center">
        <p class="grey--text headline">
          Hey, there, looks like you need a budget for
          {{ month }}
        </p>
        <v-btn v-on:click.prevent="createBudget" tile color="primary" dark>
          Starting planning for {{ month }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { utilsMixin, ONLY_MONTH } from '../mixins/utilsMixin.js'
export default {
  name: 'CreateBudget',

  mixins: [utilsMixin],

  props: {
    budgetDate: {
      type: String,
      required: true
    }
  },

  methods: {
    createBudget() {
      this.$store
        .dispatch('budget/createBudget', this.budgetDate)
        .then(() => {})
    }
  },

  computed: {
    ...mapState('budget', ['months']),
    month() {
      return this.formatDate(this.budgetDate, ONLY_MONTH)
    }
  }
}
</script>

<style lang="scss" scoped></style>
