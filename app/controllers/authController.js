// node_modules
var passport = require('passport')

// custom_modules
var domainUrl = require('../../custom_modules/domain-check')

// models
var User = require('../models/user')

//Controllers
var authCtrl = {
  stravaRequest: (req,res) => {
    res.redirect('https://www.strava.com/oauth/authorize?client_id=' + process.env.STRAVA_ID + '&response_type=code&redirect_uri=' + domainUrl + '/auth/strava/callback&approval_prompt=force&scope=public')
  },
  stravaResponse: (req,res, next) => {
    passport.authenticate('strava', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/user/login'); }

      req.session.user = user
      return res.redirect('/user/' + user.id);
    })(req, res, next);
  },
  facebookRequest: passport.authenticate('facebook', {scope: ["public_profile","email"] } ),
  facebookResponse: (req, res, next) => {
    passport.authenticate('facebook', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/user/login'); }

      req.session.user = user
      return res.redirect('/user/' + user.id);
    })(req, res, next);

  }
}

module.exports = authCtrl

