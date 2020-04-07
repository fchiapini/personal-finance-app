<template>
  <v-container fluid>
    <v-progress-linear
      v-if="loader"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-expansion-panels v-model="panel" flat tile>
          <v-expansion-panel>
            <v-expansion-panel-header color="primary" class="white--text">
              {{ monthlyBudgetTitle }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-sheet class="mx-auto" color="white" max-width="700">
                <v-slide-group mandatory show-arrows>
                  <v-slide-item
                    v-for="date in dateList"
                    :key="date.id"
                    v-slot:default="{ active }"
                  >
                    <v-card
                      class="mx-2"
                      :color="active ? 'green' : 'grey lighten-1'"
                      :input-value="active"
                      @click="onSelectDate(date.id)"
                      outlined
                    >
                      <v-card-text class="white--text">
                        {{
                          date.date.toLocaleString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })
                        }}
                      </v-card-text>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="selectedCurrency"
          :items="currencies"
          label="Currency"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="currentBudget">
      <v-col cols="12" md="8">
        <v-row>
          <v-col>
            <Income
              :date="currentBudget.date"
              :incomes="currentBudget.incomes"
              :key="forceReRenderIncomeDataTableKey"
            ></Income>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <Expense
              :date="currentBudget.date"
              :expenses="currentBudget.expenses"
              :key="forceReRenderExpenseDataTableKey"
            ></Expense>
          </v-col>
        </v-row>
      </v-col>
      <v-col align-self="center" cols="12" md="4">
        <BudgetPercentageChart
          :monthlyBugdet="currentBudget"
        ></BudgetPercentageChart>
      </v-col>
    </v-row>
    <v-row v-if="currentBudget">
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title color="primary">
            Monthly balance
          </v-card-title>
          <v-card-text>
            <MonthlyBalanceChart
              :yearlyBudget="yearlyBudget"
            ></MonthlyBalanceChart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title color="primary">Monthly wealth growth</v-card-title>
          <v-card-text>
            <MonthlyWealthGrowthChart
              :yearlyBudget="yearlyBudget"
            ></MonthlyWealthGrowthChart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="currentBudget"></v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Income from './Income.vue'
import Expense from './Expense.vue'
import BudgetPercentageChart from './BudgetPercentageChart.vue'
import MonthlyBalanceChart from './MonthlyBalanceChart.vue'
import MonthlyWealthGrowthChart from './MonthlyWealthGrowthChart.vue'
import { CURRENCY_OPTIONS } from '../plugins/vuecurrencyfilter'

export default {
  name: 'Budget',

  components: {
    Income,
    Expense,
    BudgetPercentageChart,
    MonthlyBalanceChart,
    MonthlyWealthGrowthChart
  },

  data: () => ({
    panel: null,
    budgetDate: null,
    selectedBudgetDate: null,
    dateList: [],
    selectedCurrency: null,
    forceReRenderIncomeDataTableKey: 0,
    forceReRenderExpenseDataTableKey: 0
  }),

  created() {
    this.$store.dispatch('budget/bindBudgets').then(() => {
      this.$store.dispatch('stopLoading')
    })
    this.$store.dispatch('user/loadUserConfiguration').then(() => {
      this.selectedCurrency = this.user.configuration.options.currency
    })
    this.dateList = this.initDateList()
  },

  methods: {
    initDateList() {
      let now = new Date()
      let dateList = []
      const backForwardMaxDifferenceInMonthsFromCurrentDate = 12
      let previousMonth = null
      let nextMonth = null
      let previousMonthObj = null
      let nextMonthObj = null

      dateList.push({
        id: now.toLocaleString('en-US', {
          month: 'numeric',
          year: 'numeric'
        }),
        date: now
      })
      for (
        let i = backForwardMaxDifferenceInMonthsFromCurrentDate;
        i > 0;
        i--
      ) {
        previousMonth = new Date(now.getFullYear(), now.getMonth() - i)
        nextMonth = new Date(now.getFullYear(), now.getMonth() + i)

        previousMonthObj = {
          id: previousMonth.toLocaleString('en-US', {
            month: 'numeric',
            year: 'numeric'
          }),
          date: previousMonth
        }

        nextMonthObj = {
          id: nextMonth.toLocaleString('en-US', {
            month: 'numeric',
            year: 'numeric'
          }),
          date: nextMonth
        }

        dateList.push(previousMonthObj, nextMonthObj)
      }
      return dateList.sort((a, b) => a.date - b.date)
    },
    onSelectDate(selectedDate) {
      this.selectedBudgetDate = selectedDate
      this.panel = null
    },
    onSubmit() {
      this.$store.dispatch('budget/createBudget', this.budgetDate).then(() => {
        this.selectedBudgetDate = this.budgetDate
        this.dialog = !this.dialog
        this.budgetDate = null
      })
    },
    formatMonthYearDate(date) {
      let [month, year] = date.split('/')
      return `${this.months[Number(month - 1)]} ${year}`
    },
    resetValues() {
      this.dialog = false
      this.budgetDate = null
    },
    getYear(strDate) {
      return strDate.split('/')[1]
    }
  },

  computed: {
    ...mapState('budget', ['budgets', 'months', 'currencies']),
    ...mapState('user', ['user']),
    ...mapState(['loader']),
    currentBudget() {
      if (this.selectedBudgetDate) {
        return this.budgets.find(
          (budget) =>
            budget.date ===
            this.selectedBudgetDate.toLocaleString('en-US', {
              month: 'numeric',
              year: 'numeric'
            })
        )
      }
      let latestDate = this.budgets
        .map((budget) => budget.date)
        .reduce((a, b) => {
          return a > b ? a : b
        }, '')
      return this.budgets.find((budget) => budget.date === latestDate)
    },
    monthlyBudgetTitle() {
      if (this.currentBudget) {
        return this.formatMonthYearDate(this.currentBudget.date)
      } else {
        return new Date().toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
      }
      return this.formatMonthYearDate(this.currentBudget.date)
    },
    yearlyBudget() {
      return this.budgets.filter(
        (budget) =>
          this.getYear(budget.date) === this.getYear(this.currentBudget.date)
      )
    }
  },

  watch: {
    selectedCurrency() {
      this.$store
        .dispatch('user/setUserCurrency', this.selectedCurrency)
        .then(() => {
          this.$CurrencyFilter.setConfig(
            CURRENCY_OPTIONS[this.selectedCurrency]
          )
          this.forceReRenderIncomeDataTableKey += 1
          this.forceReRenderExpenseDataTableKey += 1
        })
    }
  }
}
</script>
