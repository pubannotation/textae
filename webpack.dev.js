const path = require('path')

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  watch: true,
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
