const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let configWatch, configDevtool, configOutput, configEntry, configMode
let config, minCss

const env = (process.env.NODE_ENV === 'production')
const local = (process.env.LOCAL === 'true')

if (env) {
  configMode = 'production'
  configWatch = false
  configDevtool = false
  configEntry = './assets/src/js/main.js'
  configOutput = {
    path: path.resolve(__dirname, './assets/public/'),
    filename: 'app.js',
    publicPath: '/'
  }
  minCss = MiniCssExtractPlugin.loader
} else {
  configMode = 'development'
  configWatch = true
  configDevtool = 'cheap-module-eval-source-map'
  configEntry = [
    'webpack-hot-middleware/client', // ?http://localhost:3000/
    './assets/src/js/main.js'
  ]
  configOutput = {
    path: path.resolve('public/'),
    sourceMapFilename: '[file].map',
    filename: 'app.js',
    publicPath: '/'
  }
  minCss = 'style-loader'
}

if (local || env) {
  config = {
    entry: configEntry,
    output: configOutput,
    devtool: configDevtool,
    watch: configWatch,
    mode: configMode,
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js?$/,
          exclude: /node_modules/,
          use: ['eslint-loader']
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['env']
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            minCss,
            'css-loader'
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }

  if (env) {
    config.plugins.push(new UglifyJsPlugin())
    config.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
  } else {
    config.plugins.push(new webpack.NamedModulesPlugin())
    config.plugins.push(new CleanWebpackPlugin(['assets/public/app.js', 'assets/public/main.css', 'assets/public/fonts']))
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    config.devServer = {
      contentBase: path.resolve(__dirname),
      historyApiFallback: true,
      publicPath: '/',
      inline: true,
      noInfo: true,
      stats: { colors: true },
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      compress: true,
      port: 8080
    }
  }
}

module.exports = config
