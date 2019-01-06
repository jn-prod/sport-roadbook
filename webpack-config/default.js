const path = require('path')

module.exports = {
  dev: {
    mode: 'development',
    entry: path.resolve(__dirname, '../assets/src/js/main.js'),
    output: {
      path: path.resolve('assets/public/'),
      sourceMapFilename: '[file].map',
      filename: 'app.js',
      publicPath: '/'
    },
    watch: true,
    devtool: 'cheap-module-eval-source-map'
  },
  prod: {
    mode: 'production',
    entry: path.resolve(__dirname, '../assets/src/js/main.js'),
    output: {
      path: path.resolve('assets/public/'),
      filename: 'app.js'
    }
  },
  devtool: false,
  watch: false
}
