import { Pie, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  name: 'PieChart',

  extends: Pie,

  mixins: [reactiveProp],

  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}