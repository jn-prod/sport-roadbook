// node_modules
var passport = require('passport')

// custom_modules
var domainUrl = require('../../custom_modules/domain-check')
var facebookAuthenticate = require('../../custom_modules/facebook/facebookAuthenticate')
var stravaAuthenticate = require('../../custom_modules/strava/stravaAuthenticate')

// Controllers
var authCtrl = {
  stravaRequest: (req, res) => {
    res.redirect('https://www.strava.com/oauth/authorize?client_id=' + process.env.STRAVA_CLIENT_ID + '&response_type=code&redirect_uri=' + domainUrl + '/auth/strava/callback&approval_prompt=force&scope=public')
  },
  stravaResponse: (req, res, next) => {
    stravaAuthenticate(req, res, next)
  },
  facebookRequest: passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
  facebookResponse: (req, res, next) => {
    facebookAuthenticate(req, res, next)
  }
}

module.exports = authCtrl
