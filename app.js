require('dotenv').config()

// node_modules
var express = require('express'),
    helmet = require('helmet'),
    exphbs = require('express-handlebars'),
    path = require('path')
    url = require('url'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    path = require('path'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

// Init App
var app = express();

// MongoDB
mongoose.Promise = require('bluebird');
var mongoose = mongoose.connect(process.env.MLAB, (err, client) => {
  if (err) {
    console.error(err)
  } else {
    console.log('MongoDB is connected')
  }
});

// Http to Https
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
app.use(redirectToHTTPS());

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

// Set Static Folder
app.use(express.static(path.join(__dirname, 'assets/public')));

// Helmet
app.use(helmet())

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/html', defaultCharset: 'utf-8' }))
app.use(cookieParser());

// Cookies Session
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// passport facebook
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy(
  require('./custom_modules/facebook').token,
  require('./custom_modules/facebook').accessResponse
))

// passport strava
var StravaStrategy = require('passport-strava').Strategy;
passport.use(new StravaStrategy(
  require('./custom_modules/strava').token,
  require('./custom_modules/strava').accessResponse
));

// Locals
app.use(function(req, res, next){
  res.locals.user = req.session.user || null;
  if (process.env.LOCAL) {
    res.locals.env = true;
  } else {
    res.locals.env = false;
  }

  next();
});

// Router
app.use('/', require('./app/router/cmsRoutes'))
app.use('/user', require('./app/router/userRoutes'))
app.use('/activities', require('./app/router/activityRoutes'))
app.use('/health', require('./app/router/healthRoutes'))

// Handlebars
var hbs = exphbs.create({
  defaultLayout:'main',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials',
  helpers: require('./custom_modules/handlebars-helpers')
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

// Set Port
app.set('port', (process.env.PORT || 3000));

if(process.env.LOCAL) {
  var fs = require('fs')
  var https = require('https')

  var options = {
      key: fs.readFileSync('./certs/localhost.key'),
      cert: fs.readFileSync('./certs/localhost.cert'),
      requestCert: false,
      rejectUnauthorized: false
  };

  var httpsServer = https.createServer(options, app)

  httpsServer.listen(app.get('port'), function () {
    console.log('Launch App on http://localhost:' + app.get('port') + '/')
  })
} else {
  app.listen(app.get('port'), function () {
    console.log('Launch App on http://localhost:' + app.get('port') + '/')
  })  
}