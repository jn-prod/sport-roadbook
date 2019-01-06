const env = (process.env.NODE_ENV === 'production')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

let config
let cssConfig = []

// global config
if (!env) {
  console.log('dev mode')
  // DEVELOPPEMENT CONFIG
  config = require('./webpack-config/dev')
  cssConfig.push('style-loader')
} else {
  console.log('prod mode')
  // PRODUCTION CONFIG
  config = require('./webpack-config/prod')
}

cssConfig.push(
  {
    loader: MiniCssExtractPlugin.loader
  },
  {
    loader: 'css-loader'
  }
)

// global loader config
config.module = {
  rules: [
    {
      enforce: 'pre',
      test: /\.js?$/,
      exclude: /node_modules/,
      use: ['babel-loader', 'eslint-loader']
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
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/'
        }
      }]
    },
    {
      test: /\.(css|scss)$/,
      use: cssConfig
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
}

// global plugins config
config.plugins.push(
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default']
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css'
  }),
  new CleanWebpackPlugin(['assets/public/app.js', 'assets/public/main.css', 'assets/public/fonts'])
)

module.exports = config
