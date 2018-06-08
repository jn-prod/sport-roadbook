require('dotenv').config()

// node_modules
var express = require('express')
var helmet = require('helmet')
var exphbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy

// Init App
var app = express()

// MongoDB
mongoose.Promise = require('bluebird')
mongoose.connect(process.env.MLAB, (err, client) => {
  if (err) {
    console.error(err)
  } else {
    console.log('MongoDB is connected')
  }
})

// Http to Https
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
app.use(redirectToHTTPS())

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
app.use(express.static(path.join(__dirname, 'assets/public')))

// Helmet
app.use(helmet())

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({ type: 'text/html', defaultCharset: 'utf-8' }))
app.use(cookieParser())

// Cookies Session
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// passport facebook
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy(
  require('./custom_modules/facebook/facebookAuth').token,
  require('./custom_modules/facebook/facebookAuth').accessResponse
))

// passport strava
var StravaStrategy = require('passport-strava').Strategy
passport.use(new StravaStrategy(
  require('./custom_modules/strava/stravaAuth').token,
  require('./custom_modules/strava/stravaAuth').accessResponse
))

// Locals
app.use(function (req, res, next) {
  res.locals.user = req.session.user || null
  if (process.env.LOCAL) {
    res.locals.env = true
  } else {
    res.locals.env = false
  }

  next()
})

// Router
app.use('/', require('./app/router/cmsRoutes'))
app.use('/user', require('./app/router/userRoutes'))
app.use('/activities', require('./app/router/activityRoutes'))
app.use('/health', require('./app/router/healthRoutes'))
app.use('/auth', require('./app/router/authRoutes'))

// Handlebars
var hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials',
  helpers: require('./custom_modules/handlebars-helpers')
})

app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, '/app/views/'))
app.set('view engine', 'handlebars')

// 404
app.use((req, res, next) => {
  res.status(404)

  // respond with html page
  if (req.accepts('html')) {
    res.redirect('/')
  }
})

// Set Port
app.set('port', (process.env.PORT || 3000))

if (process.env.LOCAL) {
  var fs = require('fs')
  var https = require('https')

  var options = {
    key: fs.readFileSync('./certs/localhost.key'),
    cert: fs.readFileSync('./certs/localhost.cert'),
    requestCert: false,
    rejectUnauthorized: false
  }

  var httpsServer = https.createServer(options, app)

  httpsServer.listen(app.get('port'), () => {
    console.log('Launch App on http://localhost:' + app.get('port') + '/')
  })
} else {
  app.listen(app.get('port'), () => {
    console.log('Launch App on http://localhost:' + app.get('port') + '/')
  })
}
