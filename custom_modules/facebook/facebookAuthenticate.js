// node_modules
var passport = require('passport')

var facebookAuthenticate = (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.redirect('/user/login')
    } else {
      req.session.user = user
      res.redirect('/user/' + user.id)
    }
  })(req, res, next)
}

module.exports = facebookAuthenticate
