//Controllers
var cmsCtrl = {
  index : function(req, res){
    if(req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      res.render('partials/cms/index', {index: true})
    }
  }
}

module.exports = cmsCtrl