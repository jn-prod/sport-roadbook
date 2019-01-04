var authenticated = (req, res, next) => {
  if (req.session.user) {
    return next()
  } else {
    res.redirect('/user/login')
  }
}

module.exports = authenticated
