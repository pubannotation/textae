const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const PACKAGE = require('./package.json')
const { name, version } = PACKAGE
const TerserPlugin = require('terser-webpack-plugin')

const entry = {}
entry[`${name}-${version}.min`] = './src/index.js'
entry[`${name}-${version}`] = './src/index.js'

module.exports = merge(common, {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, 'src/lib'),
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
    maxEntrypointSize: 992396,
    maxAssetSize: 992396
  }
})
