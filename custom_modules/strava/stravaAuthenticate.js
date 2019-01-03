// node_modules
var passport = require('passport')

// models
var User = require('../../app/models/user')

var stravaAuthenticate = (req, res, next) => {
  passport.authenticate('strava', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.redirect('/user/login')
    } else {
      User
        .findOneAndUpdate({ _id: user._id }, { $set: { 'strava_refresh_token': req.query.code } }, (err, updateUser) => {
          if (err) {
            res.redirect('/user/login')
          } else {
            req.session.user = user
            res.redirect('/user/' + user.id + '/wait')
          }
        })
    }
  })(req, res, next)
}

module.exports = stravaAuthenticate
