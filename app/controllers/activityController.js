// models
var User = require('../models/user')
var Activity = require('../models/activity')

// Controllers
var activityCtrl = {
  getAddActivity: (req, res) => {
    if (req.session.user) {
      res.render('partials/activity/add')
    } else {
      res.redirect('/user/login')
    }
  },
  postAddActivity: (req, res) => {
    function convertTime (hours, minutes, seconds) {
      return (hours * 60 * 60) + (minutes * 60) + parseInt(seconds)
    }

    var form = req.body
    form.user = res.locals.user._id
    form.distance = form.distance * 1000
    form.moving_time = convertTime(form.moving_time_hours, form.moving_time_minutes, form.moving_time_seconds)
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
