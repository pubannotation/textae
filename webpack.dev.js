const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        include: [
          path.resolve(__dirname, 'node_modules/ajv'),
          path.resolve(__dirname, 'node_modules/uri-js')
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  watch: true
})
