const path = require('path')

module.exports = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'src/lib'),
    filename: 'bundle.js'
  }
}
