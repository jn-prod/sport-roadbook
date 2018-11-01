// models
var Activity = require('../models/activity')
// var today = new Date(Date.now())

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
    // if (form.moving_time * 1 > 0 && form.fc_moyenne * 1 > 0) {
    //   // definition du seuil
    //   var seuil
    //   if (form.user.fc_max !== undefined) {
    //     seuil = form.user.fc_max * 0.80
    //   } else if (form.user.date_of_birth) {
    //     seuil = (220 - (today.getFullYear() - form.user.date_of_birth.getFullYear())) * 0.80
    //   } else {
    //     seuil = 200 * 0.80
    //   }
    //   var intensityFactor = form.fc_moyenne / seuil
    //   form.tss = ((form.moving_time * form.fc_moyenne * intensityFactor) / (seuil * 3600)) * 100
    // }

    var newActivity = new Activity(form)
    newActivity.save((err, activity) => {
      if (err) throw err
      else {
        res.redirect('/user/' + req.session.user._id)
      }
    })
  },
  getStravaActivities: (req, res) => {
    var strava = {
      stravaId: req.session.user.strava_id,
      stravaCode: req.session.strava,
      stravaApi: require('../../custom_modules/strava/stravaGetUserActivities')
    }

    if (strava.stravaId && strava.stravaCode) {
      strava.stravaApi(strava.stravaId, strava.stravaCode, (activities) => {
        activities.forEach((stravaActivity) => {
          Activity
            .findOne({ 'strava_id': stravaActivity.id })
            .exec((err, res) => {
              if (err) throw err
              if (res === null) {
                var activity = {
                  user: req.session.user._id,
                  type: stravaActivity.type,
                  name: stravaActivity.name,
                  distance: stravaActivity.distance,
                  moving_time: stravaActivity.moving_time,
                  total_elevation_gain: stravaActivity.total_elevation_gain,
                  start_date_local: stravaActivity.start_date_local,
                  average_speed: stravaActivity.average_speed,
                  calories: stravaActivity.calories,
                  fc_moyenne: stravaActivity.average_heartrate,
                  strava_id: stravaActivity.id
                }
                var newActivity = new Activity(activity)
                newActivity.save((err, savedActivity) => {
                  if (err) throw err
                  else {
                    console.log(savedActivity.id + ': saved')
                  }
                })
              }
            })
        })
        res.redirect('/user/' + req.session.user._id)
      })
    } else {
      res.redirect('/user/' + req.session.user._id)
    }
  }
}

module.exports = activityCtrl
