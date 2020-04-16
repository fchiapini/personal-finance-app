<template>
  <LineChart
    :chart-data="generateChartData"
    :options="chartOptions"
  ></LineChart>
</template>

<script>
import { mapState } from 'vuex'
import LineChart from './LineChart.vue'

export default {
  name: 'MonthlyWealthGrowthChart',

  props: {
    yearlyBudget: {
      type: Array,
      default: null
    }
  },

  components: {
    LineChart
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
      const labels = this.months
      const data = this.calculateMonthlyWealthGrowth(labels)

      return {
        labels: labels,
        datasets: [
          {
            label: new Date(
              this.yearlyBudget[0].date
                .split('/')
                .reverse()
                .join('-')
            ).getFullYear(),
            backgroundColor: '#0C71E0',
            borderColor: '#0C71E0',
            data,
            fill: false
          }
        ]
      }
    }
  },

  methods: {
    calculateMonthlyWealthGrowth(labels) {
      let monthBudget = null
      let monthBalance = null
      let data = []
      labels.forEach((label) => {
        let month = labels.indexOf(label)
        monthBudget = this.yearlyBudget.find(
          (budget) =>
            new Date(
              budget.date
                .split('/')
                .reverse()
                .join('-')
            ).getMonth() == month
        )
        if (monthBudget) {
          monthBalance = this.calculateMonthBalance(monthBudget)
          if (data.length === 0) {
            data[month] = monthBalance
          } else {
            data[month] = data[month - 1] + monthBalance
          }
        } else {
          data.push(0)
        }
      })
      return data
    },
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
