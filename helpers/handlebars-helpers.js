const dayjs = require('dayjs')

module.exports = {
  currentYear: () => { return dayjs().year() },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
