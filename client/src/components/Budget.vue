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
          <v-btn color="primary" dark v-on="on">New Budget</v-btn>
          <v-btn color="primary" @click="logout" dark>Log out</v-btn>
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
            <v-btn color="blue darken-1" text @click="dialog = false"
              >Close</v-btn
            >
            <v-btn color="blue darken-1" text @click="onSubmit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        v-model="selectedBudgetDate"
        v-on:change="loadSelectedBudget"
        :items="budgetDateList"
        item-text="text"
        item-value="value"
        label="Select your month's budget"
        outlined
      ></v-select>
    </v-col>
    <v-row>
      <v-col :cols="12">
        <v-card class="ma-3 pa-6" outlined tile>
          <span>Budget for {{}}</span>
          <BudgetPercentageChart
            :monthlyBugdet="currentBudget"
          ></BudgetPercentageChart>
        </v-card>
        <v-card class="ma-3 pa-6" outlined tile>
          <Income
            :date="currentBudget.date"
            :incomes="currentBudget.incomes"
            @add-item="addItem"
            @update-item="updateItem"
            @delete-item="deleteItem"
          ></Income>
        </v-card>
        <v-card class="ma-3 pa-6" outlined tile>
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

class User {
  constructor(id, name, email, image) {
    this.id = id
    this.name = name
    this.email = email
    this.image = image
  }
}

export default {
  name: 'Budget',

  components: {
    Income,
    Expense,
    BudgetPercentageChart
  },

  data: () => ({
    user: null,
    dialog: false,
    budgetDate: null,
    selectedBudgetDate: null,
    selectedBudget: null,
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
    ]
  }),

  firestore() {
    return {
      budgets: db
        .collection('budgets')
        .where('userId', '==', firebaseApp.auth().currentUser.uid)
    }
  },

  created() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = new User(
          user.uid,
          user.displayName,
          user.email,
          user.photoURL
        )
        this.initialize()
      }
    })
  },

  methods: {
    initialize() {
      this.selectedBudget = this.budgets.concat().sort()[0]
    },
    onSubmit() {
      db.collection('budgets').add({
        date: this.budgetDate,
        incomes: [],
        expenses: [],
        userId: this.user.id
      })
      this.dialog = !this.dialog
      this.budgetDate = null
    },
    formatMonthYearDate(date) {
      let budgetDate = new Date(date)
      return `${this.months[budgetDate.getMonth()]} ${budgetDate.getFullYear()}`
    },
    loadSelectedBudget() {
      this.selectedBudget = this.budgets.filter(
        budget => budget.date === this.selectedBudgetDate
      )[0]
    },
    logout: function() {
      firebaseApp
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('login')
        })
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
      db.collection('budgets')
        .doc(document.id)
        .set(document)
        .then(() => {
          console.log('budget expenses updated!')
        })
    }
  },

  computed: {
    currentBudget() {
      return this.selectedBudgetDate === null
        ? this.budgets[0]
        : this.budgets.filter(
            budget => budget.date === this.selectedBudgetDate
          )[0]
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
  }
}
</script>
