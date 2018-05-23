require('dotenv').config()

var express = require('express'),
    helmet = require('helmet'),
    exphbs = require('express-handlebars'),
    path = require('path')
    url = require('url');

// Init App
var app = express();

// Webpack
if (process.env.LOCAL === 'true') {
  var webpack = require('webpack')
  var webpackConfig = require('./webpack.config')
  var compiler = webpack(webpackConfig)
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var webpackHotMiddleware = require('webpack-hot-middleware')
  app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {colors: true},
      reload: true,
      inline: true
    })
  )
  app.use(webpackHotMiddleware(compiler))  
}

// Helmet
app.use(helmet())

// Router
var cms = require('./app/router/cmsRoutes');
var users = require('./app/router/userRoutes');
app.use('/', cms)
app.use('/user', users)

// Handlebars
var hbs = exphbs.create({
  defaultLayout:'main',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials',
  helpers: {
      date: (val) => { return val.getDate() + '/' + (parseInt(val.getMonth()) + 1 ) + '/' + val.getFullYear() },
      dateFullYear: (val) => { return val.getUTCFullYear() },
      dateMonth: (val) => { return ( val.getUTCMonth() + 1 )},
      dateDay: (val) => { return val.getUTCDate() },
      dateHours: (val) => { return val.getUTCHours() },
      dateMinutes: (val) => { return val.getUTCMinutes() }    
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '/app/views/'));
app.set('view engine', 'handlebars');

// 404
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.redirect('/');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(3000, function () {
  console.log('Launch App on http://localhost:3000/')
})