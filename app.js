require('dotenv').config()

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
    FacebookStrategy = require('passport-facebook').Strategy,
    https = require('https');

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
app.use(redirectToHTTPS([/localhost:(\d{4})/]));

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

// passport
var callbackURL;

if (process.env.LOCAL) {
  callbackURL= "http://localhost:3000/auth/facebook/callback"
} else {
  callbackURL = "http://www.feezify.me/auth/facebook/callback"
}

var fbOpts = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: callbackURL,
  profileFeilds: ['emails']
}

var fbCallback = (accessToken, refreshToken, profile, cb) => {
 console.log(accessToken, refreshToken, profile, cb)
}

passport.use(new FacebookStrategy(fbOpts, fbCallback))

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
var cms = require('./app/router/cmsRoutes');
var users = require('./app/router/userRoutes');
var activities = require('./app/router/activityRoutes')
var health = require('./app/router/healthRoutes')
app.use('/', cms)
app.use('/user', users)
app.use('/activities', activities)
app.use('/health', health)

// Handlebars
var hbs = exphbs.create({
  defaultLayout:'main',
  layoutsDir:'app/views/layouts',
  partialsDir:'app/views/partials',
  helpers: {
      date: (val) => { return val.getDate() + '/' + (parseInt(val.getMonth()) + 1 ) + '/' + val.getFullYear() },
      dateStrava: (val) => { var date = new Date(val); return date.getDate() + '/' + (parseInt(date.getMonth()) + 1 ) + '/' + date.getFullYear() },
      secondToTime: (val) => {
        var sec_num = parseInt(val, 10)
        var hours   = Math.floor(sec_num / 3600)
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
        var seconds = sec_num - (hours * 3600) - (minutes * 60)

        if (hours   < 10) {hours   = "0" + hours}
        if (minutes < 10) {minutes = "0" + minutes}
        if (seconds < 10) {seconds = "0" + seconds}
        return hours + ':' + minutes + ':' + seconds
      },
      rpe: (val) => { return val / 10 * 100 },
      stravaDist: (val) => { var dist = val / 1000; return  Number.parseFloat(dist).toFixed(3) },
      adverageSpeed: (sport, dist, time) => {
        if (sport.toUpperCase() === 'RUN' || sport.toUpperCase() === 'TRAIL') {
          var speed = Number.parseFloat((time / 60) / (dist / 1000) ).toFixed(2)
          var min = String(speed).split('.')[0]
          var sec = parseInt(String(speed).split('.')[1] * 60 / 100)
          return min + ':' + sec + 'min/Km'
        } else {
          return  Number.parseFloat((dist / 1000) / (time / 3600)).toFixed(2) + 'Km/h'
        }
      },
      boolean: (val) => { if (val === true) { return 'oui'} else { return 'non'} }
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

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Launch App on http://localhost:' + process.env.PORT + '/')
})