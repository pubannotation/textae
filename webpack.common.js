module.exports = {
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
