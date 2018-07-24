// Controllers
var cmsCtrl = {
  index: (req, res) => {
    if (req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      res.redirect('/user/login')
    }
  },
  mentionsLegales: (req, res) => {
    res.render('partials/cms/mentions-legales')
  }
}

module.exports = cmsCtrl
