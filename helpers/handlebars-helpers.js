const dayjs = require('dayjs')

const compare = ('when', (val1, val2, options) => {
  return val1 === val2 ? options.fn(this) : options.inverse(this)
})

module.exports = {
  currentYear: () => { return dayjs().year() },
  compare
}
