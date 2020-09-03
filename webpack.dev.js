const path = require('path')

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  watch: true
}
