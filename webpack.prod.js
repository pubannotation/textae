const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const PACKAGE = require('./package.json')
const { name, version } = PACKAGE
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'src/lib'),
    filename: `${name}-${version}.min.js`
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  },
  performance: {
    maxEntrypointSize: 991232,
    maxAssetSize: 991232
  }
})
