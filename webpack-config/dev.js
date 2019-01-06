const path = require('path')
var data = require('./default').dev

let config = {
  mode: data.mode,
  entry: data.entry,
  output: {
    path: data.output.path,
    filename: data.output.filename
  },
  plugins: [],
  devServer: {
    contentBase: path.resolve(__dirname, './'),
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: 8000,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  devtool: data.devtool,
  watch: data.watch
}

module.exports = config
