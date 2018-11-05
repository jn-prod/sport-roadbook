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
    form.start_date_local = new Date(form.start_date_local)

    // convertion du temps HH:mm:ss en secondes
    form.moving_time = convertTime(form.moving_time_hours, form.moving_time_minutes, form.moving_time_seconds)

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

              // if new activity
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
                  fc_max: stravaActivity.max_heartrate,
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

              // update activity
              if (res.fc_max !== stravaActivity.max_heartrate) {
                Activity
                  .findOneAndUpdate({
                    'strava_id': stravaActivity.id
                  }, {
                    $set: { fc_max: stravaActivity.max_heartrate }
                  }, (err) => {
                    if (err) throw err
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
