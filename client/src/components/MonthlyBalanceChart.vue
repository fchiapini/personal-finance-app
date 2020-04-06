<template>
  <BarChart :chart-data="generateChartData" :options="chartOptions"></BarChart>
</template>

<script>
import { mapState } from 'vuex'
import BarChart from './BarChart.vue'

export default {
  name: 'MonthlyBalanceChart',

  props: {
    yearlyBudget: {
      type: Array,
      default: null
    }
  },

  components: {
    BarChart
  },

  data: () => ({
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return `${data['labels'][tooltipItem['index']]}: ${
              data['datasets'][0]['data'][tooltipItem['index']]
            }`
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    },
    chartBackGroundColors: {
      red: '#f87979',
      blue: '#0C71E0'
    }
  }),

  computed: {
    ...mapState('budget', ['months']),
    generateChartData() {
      let labels = this.months
      let backgroundColor = []
      let data = []
      let monthBudget = null
      let monthBalance = 0

      labels.forEach((label) => {
        monthBudget = this.yearlyBudget.find(
          (budget) => new Date(budget.date).getMonth() == labels.indexOf(label)
        )
        if (monthBudget) {
          monthBalance = this.calculateMonthBalance(monthBudget)
          if (monthBalance > 0) {
            backgroundColor.push(this.chartBackGroundColors.blue)
          } else {
            backgroundColor.push(this.chartBackGroundColors.red)
          }
          data.push(monthBalance)
        }
      })

      return {
        labels: labels,
        datasets: [
          {
            label: new Date(this.yearlyBudget[0].date).getFullYear(),
            backgroundColor,
            data
          }
        ]
      }
    }
  },

  methods: {
    calculateMonthBalance(monthBudget) {
      let sumIncome = monthBudget.incomes
        .map((income) => income.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      let sumExpense = monthBudget.expenses
        .map((expense) => expense.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      return Number((sumIncome - sumExpense).toFixed(2))
    }
  }
}
</script>
