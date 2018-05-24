//Controllers
var cmsCtrl = {
  index : function(req, res){
    res.render('partials/cms/index', {index: true})
  }
}

module.exports = cmsCtrl