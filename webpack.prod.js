const path = require('path')
const PACKAGE = require('./package.json')
const { name, version } = PACKAGE
const TerserPlugin = require('terser-webpack-plugin')

const entry = {}
entry[`${name}-${version}.min`] = './src/index.js'
entry[`${name}-${version}`] = './src/index.js'

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        include: /\.min\.js$/
      })
    ]
  },
  performance: {
    maxAssetSize: 4 * 1024 * 1024,
    maxEntrypointSize: 24 * 1024 * 1024
  }
}
