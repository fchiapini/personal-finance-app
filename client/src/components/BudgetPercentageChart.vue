<template>
  <DoughnutChart
    :chart-data="generateChartData"
    :options="chartOptions"
  ></DoughnutChart>
</template>

<script>
import DoughnutChart from './DoughnutChart.js'

export default {
  name: 'BudgetPercentageChart',

  props: {
    monthlyBugdet: {
      type: Object,
      default: null
    }
  },

  components: {
    DoughnutChart
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
            }%`
          }
        }
      }
    },
    chartBackGroundColors: [
      '#41B883',
      '#E46651',
      '#00D8FF',
      '#DD1B16',
      '#68C2EF',
      '#F7A950',
      '#D15A63',
      '#2D58CC',
      '#34B667',
      '#DAC18F'
    ]
  }),

  computed: {
    generateChartData() {
      const categories = this.monthlyBugdet.expenses.map(
        expense => expense.category
      )

      // remove duplicated categories
      const labels = categories.filter((a, b) => categories.indexOf(a) === b)

      let backgroundColor = []
      let data = []
      let sumIncomeTotal = this.monthlyBugdet.incomes
        .map(income => income.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      labels.forEach(label => {
        backgroundColor.push(this.chartBackGroundColors[labels.indexOf(label)])
        data.push(
          this.calculateBudgetPercentageByCategoryExpense(sumIncomeTotal, label)
        )
      })

      labels.push(`Month's saving`)
      data.push(
        100 -
          data.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          )
      )

      return {
        labels: labels,
        datasets: [
          {
            backgroundColor,
            data
          }
        ]
      }
    }
  },

  methods: {
    calculateBudgetPercentageByCategoryExpense(sumIncomeTotal, category) {
      let sumExpenseByCategory = this.monthlyBugdet.expenses
        .filter(expense => expense.category === category)
        .map(expense => expense.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue)

      return Number((sumExpenseByCategory / (sumIncomeTotal * 0.01)).toFixed(2))
    }
  }
}
</script>
