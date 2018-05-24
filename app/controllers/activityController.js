var User = require('../models/user')
var Activity = require('../models/activity')

//Controllers
var activityCtrl = {
  getAddActivity: (req, res) => {
    if (req.session.user) {
      res.render('partials/activity/add')
    } else {
      res.redirect('/user/login')
    }
  },
  postAddActivity: (req, res) => {
    var form = req.body
    form.user = res.locals.user._id
    form.distance = form.distance * 1000
    var newActivity = new Activity(form)
    newActivity.save((err, activity) => {
      if (err) throw err
      else {
        res.redirect('/user/' + req.session.user._id)                   
      }
    })
  }
}

module.exports = activityCtrl