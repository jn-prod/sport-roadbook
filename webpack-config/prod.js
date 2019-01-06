var data = require('./default').prod
const MinifyPlugin = require('babel-minify-webpack-plugin')

let config = {
  mode: data.mode,
  entry: data.entry,
  output: {
    path: data.output.path,
    filename: data.output.filename
  },
  plugins: [
    new MinifyPlugin()
  ],
  optimization: {
    // minimizer: [    ]
  },
  devtool: data.devtool,
  watch: data.watch
}

module.exports = config
