// node_modules
var passport = require('passport')

var stravaAuthenticate = (req, res, next) => {
  passport.authenticate('strava', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.redirect('/user/login')
    } else {
      req.session.strava = req.query.code
      req.session.user = user
      res.redirect('/user/' + user.id)
    }
  })(req, res, next)
}

module.exports = stravaAuthenticate
