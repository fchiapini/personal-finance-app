<template>
  <PieChart :chart-data="dataCollection" :options="chartOptions"></PieChart>
</template>

<script>
import PieChart from './PieChart.js';

export default {
  name: 'BudgetPercentageChart',

  props: {
    monthlyBugdet: {
      type: Object,
      default: null
    }
  },

  components: {
    PieChart
  },

  data: () => ({
    dataCollection: null,
    chartOptions: { responsive: true, maintainAspectRatio: false },
    chartBackGroundColors: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#68C2EF', '#F7A950', '#D15A63', '#2D58CC', '#34B667', '#DAC18F']
  }),

  mounted() {
    this.generateChartData();
  },

  methods: {
    generateChartData() {
      const categories = this.monthlyBugdet.expenses.map(expense => expense.category);

      // remove duplicated categories
      const labels = categories.filter((a,b) => categories.indexOf(a) === b);

      let backgroundColor = [];
      let data = [];
      let sumIncomeTotal = this.monthlyBugdet.incomes.map(income => income.amount)
          .reduce((accumulator, currentValue) => accumulator + currentValue);

      labels.forEach(label => {
        backgroundColor.push(this.chartBackGroundColors[labels.indexOf(label)]);
        data.push(this.calculateBudgetPercentageByCategoryExpense(sumIncomeTotal, label));
      });

      this.dataCollection = {
        labels: labels,
        datasets: [
          {
            backgroundColor,
            data
          }
        ]
      }

    },
    calculateBudgetPercentageByCategoryExpense(sumIncomeTotal, category) {
      return this.monthlyBugdet.expenses.filter(expense => expense.category === category)
        .map(expense => expense.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    }
  }
}
</script>