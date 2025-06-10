const path = require('path')

module.exports = {
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
        ],
        parser: {
          amd: false, // disable AMD
          commonjs: true, // disable CommonJS
          system: false, // disable SystemJS
          harmony: false, // disable ES2015 Harmony import/export
          requireInclude: false, // disable require.include
          requireEnsure: false, // disable require.ensure
          requireContext: false, // disable require.context
          browserify: false, // disable special handling of Browserify bundles
          requireJs: false, // disable requirejs.*
          node: false, // disable __dirname, __filename, module, require.extensions, require.main, etc.
          commonjsMagicComments: false // disable magic comments support for CommonJS
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  watch: true,
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  devtool: 'eval-source-map'
}
