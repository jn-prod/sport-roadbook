//Controllers
var cmsCtrl = {
  index : (req, res) => {
    if(req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      res.render('partials/cms/index', {index: true})
    }
  },
  mentionsLegales: (req, res) => {
    res.render('partials/cms/mentions-legales')
  }
}

module.exports = cmsCtrl