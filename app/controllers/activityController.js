// models
var Activity = require('../models/activity')
var today = new Date(Date.now())

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
    
    // convertion du temps HH:mm:ss en secondes
    form.moving_time = convertTime(form.moving_time_hours, form.moving_time_minutes, form.moving_time_seconds)

    // calcul du TSS
    if (form.moving_time * 1 > 0 && form.fc_moyenne * 1 > 0) {
      // definition du seuil
      var seuil
      if (form.user.fc_max !== undefined) {
        seuil = form.user.fc_max * 0.80
      } else if(form.user.date_of_birth) {
        seuil = (220 - (today.getFullYear() - form.user.date_of_birth.getFullYear())) * 0.80
      } else {
        seuil = 200 * 0.80
      }
      var intensityFactor = form.fc_moyenne / seuil
      form.tss = ((form.moving_time * form.fc_moyenne * intensityFactor) / ( seuil * 3600)) * 100
    }
    
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
