<template>
  <v-container fluid>
    <v-row justify="end">
    <v-dialog v-model="dialog" persistent max-width="1000px" @submit.prevent="onSubmit">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">New Budget</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Budget</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-date-picker v-model="budgetDate" type="month"></v-date-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="onSubmit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <v-row>
       <v-col cols="12">
        <v-row
          align="center"
          justify="center"
          class="grey lighten-5"
        >
          <v-card
            v-for="budget in sortedBudgets"
            :key="budget.date"
            class="ma-3 pa-6"
            outlined
            tile
          >
            <span>{{ budget.date }}</span>
            <Income :date="budget.date" :incomes="budget.incomes" ></Income>
            <Expense :date="budget.date" :expenses="budget.expenses" ></Expense>
            <BudgetPercentageChart :monthlyBugdet="budget"></BudgetPercentageChart>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Income from './Income.vue';
import Expense from './Expense.vue';
import BudgetPercentageChart from './BudgetPercentageChart.vue';

class Budget {
  constructor(date, incomes=[], expenses=[]) {
    this.date = date;
    this.incomes = incomes;
    this.expenses = expenses;
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
    dialog: false,
    budgetDate: null,
    budgets: [],
    monthName: ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
  }),

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.budgets = [ new Budget('2020-01',
        [
          {
            category: 'Salary',
            amount: 100000
          },
          {
            category: 'Renting',
            amount: 100000
          },
          {
            category: 'Vacation',
            amount: 100000
          },
          {
            category: 'Extra hours',
            amount: 100000
          }
        ], 
        [
          {
            category: 'Housing',
            amount: 100000,
            description: 'Renting'
          },
          {
            category: 'Food',
            amount: 30000,
            description: 'Supermarket'
          },
          {
            category: 'Housing',
            amount: 30000,
            description: 'Supermarket'
          }
        ])
      ];
    },
    onSubmit() {
        this.budgets.push(new Budget(this.budgetDate));
        this.dialog = !this.dialog;
        this.budgetDate = null;
    }
  },

  computed: {
    sortedBudgets() {
      return this.budgets.concat().sort();
    }
  }
}
</script>