<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="1000px"
          @submit.prevent="onSubmit"
        >
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
              <v-icon>mdi-plus</v-icon>
              New Budget
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New Budget</span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      name="date"
                      label="Select a date"
                      v-model="budgetDate"
                      :rules="[dateAlreadyCreated]"
                      readonly
                    ></v-text-field>
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
              <v-btn color="blue darken-1" text @click="resetValues">
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="!datePicked"
                @click="onSubmit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col v-if="currentBudget">
        <v-select
          v-model="selectedBudgetDate"
          :items="budgetDateList"
          item-text="text"
          item-value="value"
          label="Month's budget"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedCurrency"
          :items="currencies"
          label="Currency"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="currentBudget">
        <v-card class="ma-3 pa-6">
          <span>Budget for {{ monthlyBudgetTitle }}</span>
          <BudgetPercentageChart
            :monthlyBugdet="currentBudget"
          ></BudgetPercentageChart>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="currentBudget">
        <Income
          :date="currentBudget.date"
          :incomes="currentBudget.incomes"
        ></Income>
      </v-col>
      <v-col>
        <Expense
          :date="currentBudget.date"
          :expenses="currentBudget.expenses"
        ></Expense>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
    selectedCurrency: 'yen'
  }),

  created() {
    this.$store.dispatch('budget/bindBudgets')
    this.$CurrencyFilter.setConfig(CURRENCY_OPTIONS[this.selectedCurrency])
  },

  methods: {
    onSubmit() {
      this.$store.dispatch('budget/createBudget', this.budgetDate)
      this.dialog = !this.dialog
      this.budgetDate = null
    },
    formatMonthYearDate(date) {
      let budgetDate = new Date(date)
      return `${this.months[budgetDate.getMonth()]} ${budgetDate.getFullYear()}`
    },
    resetValues() {
      this.dialog = false
      this.budgetDate = null
    },
    availableDate() {
      return (
        this.budgets.map(budget => budget.date).indexOf(this.budgetDate) === -1
      )
    }
  },

  computed: {
    ...mapState('budget', ['budgets', 'months', 'currencies']),
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
    },
    datePicked() {
      return this.budgetDate !== null && this.availableDate()
    },
    dateAlreadyCreated() {
      return !this.availableDate()
        ? 'Budget for the selected date already created!'
        : ''
    }
  },

  watch: {
    selectedCurrency() {
      this.$CurrencyFilter.setConfig(CURRENCY_OPTIONS[this.selectedCurrency])
    }
  }
}
</script>
