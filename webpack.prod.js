const path = require('path')

module.exports = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'src/lib'),
    filename: 'bundle.js'
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      url: require.resolve('url/')
    },
    alias: {
      handlebars: 'handlebars/dist/handlebars.js'
    }
  }
}
