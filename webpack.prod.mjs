import { readFileSync } from 'fs'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'

const PACKAGE = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url))
)
const { name, version } = PACKAGE

const entry = {}
entry[`${name}-${version}.min`] = './src/index.js'
entry[`${name}-${version}`] = './src/index.js'

export default {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(path.dirname(new URL(import.meta.url).pathname), 'tmp'),
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
