export const utilsMixin = {
  methods: {
    formatMonthYearDate(date) {
      let [month, year] = date.split('/')
      return `${this.months[Number(month - 1)]} ${year}`
    }
  }
}
