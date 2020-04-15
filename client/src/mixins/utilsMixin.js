export const ONLY_MONTH = Symbol('Only month')
export const ONLY_YEAR = Symbol('Only year')
export const MONTH_AND_YEAR = Symbol('Month and year')

export const utilsMixin = {
  methods: {
    formatDate(date, formatAs) {
      let formatedDate = ''
      if (date) {
        switch (formatAs) {
          case ONLY_MONTH: {
            let month = date.substring(0, date.indexOf('/'))
            formatedDate = this.months[Number(month - 1)]
            break
          }
          case ONLY_YEAR: {
            formatedDate = date.substring(date.indexOf('/') + 1, date.length)
            break
          }
          case MONTH_AND_YEAR:
          default:
            let [month, year] = date.split('/')
            formatedDate = `${this.months[Number(month - 1)]} ${year}`
        }
        return formatedDate
      }
    }
  }
}
