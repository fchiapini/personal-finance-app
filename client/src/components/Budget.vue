<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-expansion-panels v-model="panel" flat tile>
          <v-expansion-panel>
            <v-expansion-panel-header color="primary" class="white--text">
              {{ monthlyBudgetTitle }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-sheet class="mx-auto" color="white" max-width="700">
                <v-slide-group
                  v-model="selectedItemIndex"
                  class="pt-4"
                  mandatory
                  show-arrows
                  :center-active="true"
                >
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
      <v-col cols="6" md="2">
        <v-select
          v-model="selectedCurrency"
          :items="currencies"
          label="Currency"
          outlined
          dense
        ></v-select>
      </v-col>
    </v-row>
    <template v-if="currentBudget">
      <v-row>
        <v-col align-self="start" cols="12" md="4">
          <BudgetPercentageChart
            :monthlyBugdet="currentBudget"
          ></BudgetPercentageChart>
        </v-col>
        <v-col cols="12" md="8">
          <v-row>
            <v-col class="pb-0">
              <Income
                :date="currentBudget.date"
                :incomes="currentBudget.incomes"
                :key="forceReRenderIncomeDataTableKey"
              ></Income>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0">
              <v-card outlined shaped class="mx-2">
                <v-card-text class="text-center">
                  <span class="headline cyan--text">
                    {{ Math.abs(balance) | currency }}
                  </span>
                  <span :class="balanceStyleTextClass">
                    {{ balanceText }}
                  </span>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
        <v-col align-self="start" cols="12" md="6">
          <v-row>
            <v-col>
              <v-card shaped outlined>
                <v-card-title
                  class="title font-weight-bold cyan--text text--darken-1"
                >
                  Monthly balance
                </v-card-title>
                <v-card-text>
                  <MonthlyBalanceChart
                    :yearlyBudget="yearlyBudget"
                  ></MonthlyBalanceChart>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card shaped outlined>
                <v-card-title
                  class="title font-weight-bold cyan--text text--darken-1"
                >
                  Monthly wealth growth
                </v-card-title>
                <v-card-text>
                  <MonthlyWealthGrowthChart
                    :yearlyBudget="yearlyBudget"
                  ></MonthlyWealthGrowthChart>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="!currentBudget && !loader">
      <CreateBudget :budgetDate="selectedBudgetDate"></CreateBudget>
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import CreateBudget from '@/components/CreateBudget.vue'
import Income from './Income.vue'
import Expense from './Expense.vue'
import BudgetPercentageChart from './BudgetPercentageChart.vue'
import MonthlyBalanceChart from './MonthlyBalanceChart.vue'
import MonthlyWealthGrowthChart from './MonthlyWealthGrowthChart.vue'
import { CURRENCY_OPTIONS } from '../plugins/vuecurrencyfilter'
import { utilsMixin } from '../mixins/utilsMixin.js'

export default {
  name: 'Budget',

  mixins: [utilsMixin],

  components: {
    CreateBudget,
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
    selectedItemIndex: null,
    dateList: [],
    selectedCurrency: null,
    forceReRenderIncomeDataTableKey: 0,
    forceReRenderExpenseDataTableKey: 0
  }),

  created() {
    this.dateList = this.initDateList()
    this.$store.dispatch('budget/bindBudgets').then(() => {
      this.selectedItemIndex = this.dateList.findIndex(
        (x) => x.id === this.currentBudget.date
      )
      this.$store.dispatch('stopLoading')
    })
    this.$store.dispatch('user/loadUserConfiguration').then(() => {
      this.selectedCurrency = this.user.configuration.options.currency
    })
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
      this.selectedItemIndex = this.dateList.findIndex(
        (x) => x.id === selectedDate
      )
    },
    onSubmit() {
      this.$store.dispatch('budget/createBudget', this.budgetDate).then(() => {
        this.selectedBudgetDate = this.budgetDate
        this.budgetDate = null
      })
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
      if (this.selectedBudgetDate) {
        return this.formatMonthYearDate(this.selectedBudgetDate)
      } else if (this.currentBudget) {
        return this.formatMonthYearDate(this.currentBudget.date)
      } else {
        return new Date().toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
      }
    },
    yearlyBudget() {
      return this.budgets.filter(
        (budget) =>
          this.getYear(budget.date) === this.getYear(this.currentBudget.date)
      )
    },
    balance() {
      if (this.currentBudget) {
        const sumIncome = this.currentBudget.incomes
          .map((income) => income.amount)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        const sumExpense = this.currentBudget.expenses
          .map((expense) => expense.amount)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        return sumIncome - sumExpense
      } else {
        return {}
      }
    },
    balanceText() {
      return this.balance >= 0 ? 'LEFT TO BUDGET' : 'OVER BUDGET'
    },
    balanceStyleTextClass() {
      return this.balance >= 0
        ? 'subtitle-1 blue-grey--text'
        : 'subtitle-1 red--text'
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
