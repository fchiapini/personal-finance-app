<template>
  <v-container fluid>
    <v-row justify="end">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="1000px"
        @submit.prevent="onSubmit"
      >
        <template v-slot:activator="{ on }">
          <v-btn outlined color="primary" dark v-on="on">New Budget</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Budget</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-col cols="12" sm="6" md="4">
                  <v-date-picker
                    v-model="budgetDate"
                    type="month"
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="onSubmit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-col v-if="currentBudget" class="d-flex" cols="12" sm="6">
      <v-select
        v-model="selectedBudgetDate"
        :items="budgetDateList"
        item-text="text"
        item-value="value"
        label="Select your month's budget"
        outlined
      ></v-select>
      <v-select
        v-model="selectedCurrency"
        :items="currencies"
        label="Your currency"
        outlined
      ></v-select>
    </v-col>
    <v-row>
      <v-col v-if="currentBudget" :cols="12">
        <v-card class="ma-3 pa-6">
          <span>Budget for {{ monthlyBudgetTitle }}</span>
          <BudgetPercentageChart
            :monthlyBugdet="currentBudget"
          ></BudgetPercentageChart>
        </v-card>
        <v-card class="ma-3 pa-6">
          <Income
            :date="currentBudget.date"
            :incomes="currentBudget.incomes"
            @add-item="addItem"
            @update-item="updateItem"
            @delete-item="deleteItem"
          ></Income>
        </v-card>
        <v-card class="ma-3 pa-6">
          <Expense
            :date="currentBudget.date"
            :expenses="currentBudget.expenses"
            @add-item="addItem"
            @update-item="updateItem"
            @delete-item="deleteItem"
          ></Expense>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { firebaseApp } from '../firebase/firebaseinit.js'
import { db } from '../firebase/db.js'
import Income from './Income.vue'
import Expense from './Expense.vue'
import BudgetPercentageChart from './BudgetPercentageChart.vue'
import { CURRENCY_OPTIONS } from '../plugins/vuecurrencyfilter'

export default {
  name: 'Budget',

  components: {
    Income,
    Expense,
    BudgetPercentageChart
  },

  data: () => ({
    dialog: false,
    budgetDate: null,
    selectedBudgetDate: null,
    selectedCurrency: 'yen',
    budgets: [],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    currencies: ['dollar', 'yen', 'real', 'euro']
  }),

  firestore() {
    return {
      budgets: db
        .collection('users')
        .doc(firebaseApp.auth().currentUser.uid)
        .collection('budgets')
    }
  },

  created() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.$CurrencyFilter.setConfig(CURRENCY_OPTIONS[this.selectedCurrency])
      }
    })
  },

  methods: {
    onSubmit() {
      db.collection('users')
        .doc(firebaseApp.auth().currentUser.uid)
        .collection('budgets')
        .add({
          date: this.budgetDate,
          incomes: [],
          expenses: []
        })
      this.dialog = !this.dialog
      this.budgetDate = null
    },
    formatMonthYearDate(date) {
      let budgetDate = new Date(date)
      return `${this.months[budgetDate.getMonth()]} ${budgetDate.getFullYear()}`
    },
    addItem: function(params) {
      const { date, newItem, budgetAttr } = params
      let updateBudget = this.budgets.find(budget => budget.date === date)
      updateBudget[budgetAttr].push(newItem)
      this.updateDb(updateBudget)
    },
    updateItem(params) {
      const { date, index, editedItem, budgetAttr } = params
      let updateBudget = this.budgets.find(budget => budget.date === date)
      Object.assign(updateBudget[budgetAttr][index], editedItem)
      this.updateDb(updateBudget)
    },
    deleteItem(params) {
      const { date, index, budgetAttr } = params
      let updateBudget = this.budgets.find(budget => budget.date === date)
      updateBudget[budgetAttr].splice(index, 1)
      this.updateDb(updateBudget)
    },
    updateDb(document) {
      db.collection('users')
        .doc(firebaseApp.currentUser.uid)
        .collection('budgets')
        .doc(document.id)
        .set(document)
        .then(() => {
          console.log('budget expenses updated!')
        })
    }
  },

  computed: {
    currentBudget() {
      if (this.selectedBudgetDate) {
        return this.budgets.find(
          budget => budget.date === this.selectedBudgetDate
        )
      }
      let latestDate = this.budgets
        .map(budget => budget.date)
        .reduce((a, b) => {
          return a > b ? a : b
        }, '')
      return this.budgets.find(budget => budget.date === latestDate)
    },
    monthlyBudgetTitle() {
      return this.formatMonthYearDate(this.currentBudget.date)
    },
    budgetDateList() {
      return this.budgets
        .map(budget => {
          return {
            text: this.formatMonthYearDate(budget.date),
            value: budget.date
          }
        })
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    }
  },

  watch: {
    selectedCurrency() {
      this.$CurrencyFilter.setConfig(CURRENCY_OPTIONS[this.selectedCurrency])
    }
  }
}
</script>
