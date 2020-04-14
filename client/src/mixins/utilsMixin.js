export const utilsMixin = {
  methods: {
    formatMonthFromDate(date) {
      let month = date.substring(0, date.indexOf('/'))
      return this.months[Number(month - 1)]
    },
    formatMonthYearFromDate(date) {
      let [month, year] = date.split('/')
      return `${this.months[Number(month - 1)]} ${year}`
    }
  }
}
