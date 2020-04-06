<template>
  <v-container fluid>
    <v-progress-linear
      v-if="loader"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-row justify="center">
      <v-col cols="12" md="3" v-if="currentBudget">
        <v-expansion-panels flat tile>
          <v-expansion-panel>
            <v-expansion-panel-header color="primary" class="white--text">
              {{ monthlyBudgetTitle }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-sheet class="mx-auto" color="white" max-width="700">
                <v-slide-group mandatory show-arrows>
                  <v-slide-item
                    v-for="date in dateList"
                    :key="date"
                    v-slot:default="{ active, toggle }"
                  >
                    <v-btn
                      class="mx-2"
                      color="primary"
                      :input-value="active"
                      depressed
                      text
                      @click="toggle"
                    >
                      {{
                        date.toLocaleString('default', {
                          month: 'short',
                          year: 'numeric'
                        })
                      }}
                    </v-btn>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="1000px"
          @submit.prevent="onSubmit"
        >
          <!-- <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
              {{ monthlyBudgetTitle }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template> -->
          <v-card>
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-sheet class="mx-auto" max-width="700">
                      <v-slide-group
                        v-model="selectedBudgetDate"
                        mandatory
                        show-arrows
                      >
                        <v-slide-item
                          v-for="date in dateList"
                          :key="date"
                          v-slot:default="{ active, toggle }"
                        >
                          <v-btn
                            class="mx-2"
                            :input-value="active"
                            active-class="primary white--text"
                            depressed
                            rounded
                            @click="toggle"
                          >
                            {{
                              date.toLocaleString('default', {
                                month: 'short',
                                year: 'numeric'
                              })
                            }}
                          </v-btn>
                        </v-slide-item>
                      </v-slide-group>
                    </v-sheet>
                    <!-- <v-text-field
                      name="date"
                      label="Select a date"
                      v-model="budgetDate"
                      :rules="[dateAlreadyCreated]"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="budgetDate"
                      type="month"
                    ></v-date-picker> -->
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <!-- <v-card-actions>
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
            </v-card-actions> -->
          </v-card>
        </v-dialog>
      </v-col>
      <!-- <v-col v-if="currentBudget">
        <v-select
          v-model="selectedBudgetDate"
          :items="budgetDateList"
          item-text="text"
          item-value="value"
          label="Month's budget"
          outlined
        ></v-select>
      </v-col> -->
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
      <v-col cols="12" md="4">
        <BudgetPercentageChart
          :monthlyBugdet="currentBudget"
        ></BudgetPercentageChart>
      </v-col>
    </v-row>
    <v-row v-if="currentBudget">
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title color="primary">
            Monthly balance throughout the year
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
    dialog: false,
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
      const backForwardMaxDifferenceInMonthsFromCurrentDate = 6
      let previousMonth = null
      let nextMonth = null

      dateList.push(now)
      for (
        let i = backForwardMaxDifferenceInMonthsFromCurrentDate;
        i > 0;
        i--
      ) {
        previousMonth = new Date(now.getFullYear(), now.getMonth() - i)
        nextMonth = new Date(now.getFullYear(), now.getMonth() + i)
        dateList.push(previousMonth, nextMonth)
      }
      return dateList.sort((a, b) => a - b)
    },
    onSubmit() {
      this.$store.dispatch('budget/createBudget', this.budgetDate).then(() => {
        this.selectedBudgetDate = this.budgetDate
        this.dialog = !this.dialog
        this.budgetDate = null
      })
    },
    formatMonthYearDate(date) {
      return `${this.months[Number(date.substring(5, 7))]} ${date.substring(
        0,
        4
      )}`
    },
    resetValues() {
      this.dialog = false
      this.budgetDate = null
    },
    availableDate() {
      return (
        this.budgets.map((budget) => budget.date).indexOf(this.budgetDate) ===
        -1
      )
    },
    getYear(strDate) {
      return strDate.substring(0, 4)
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
            this.selectedBudgetDate.toLocaleString('default', {
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
      return this.formatMonthYearDate(this.currentBudget.date)
    },
    budgetDateList() {
      return this.budgets
        .map((budget) => {
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
