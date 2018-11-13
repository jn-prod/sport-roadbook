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
      strava.stravaApi(strava.stravaId, strava.stravaCode, (stravaActivities) => {
        stravaActivities.forEach((stravaActivity) => {
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
            })
        })
      })
    }
    // finale redirection
    res.redirect('/user/' + req.session.user._id)
  },
  deleteActivitiy: (req, res) => {
    Activity
      .findOneAndUpdate({
        _id: req.params.activity
      }, {
        $set: { user: null }
      }, (err) => {
        if (err) throw err
      })
    // finale redirection
    res.redirect('/user/' + req.session.user._id)
  },
  activitiesOverview: (req, res) => {
    var userId = req.session.user._id
    // request db Activities
    Activity
      .find({ user: userId })
      .sort({ 'start_date_local': -1 })
      .exec((err, dbActivites) => {
        var AllFcMax = []
        var fcMax
        if (err) throw err

        dbActivites.forEach((val) => {
          // calcul du TSS
          if (val.moving_time * 1 > 0 && val.fc_moyenne * 1 > 0) {
            val.tss = 'NC'
          } else {
            val.tss = 'NC'
          }
        })

        if (dbActivites.length > 0) {
          dbActivites.forEach((activity) => {
            if (activity.fc_max === undefined) {
              AllFcMax.push(0)
            } else {
              AllFcMax.push(activity.fc_max)
            }
          })
        } else {
          AllFcMax = null
        }

        // fc max defintion
        if (AllFcMax.length === 1) {
          fcMax = AllFcMax[0]
        } else if (AllFcMax.length > 0) {
          fcMax = AllFcMax.reduce((a, b) => {
            return Math.max(a, b)
          })
        } else {
          fcMax = null
        }

        // tss
        if (fcMax > 0) {
          dbActivites.forEach((activity) => {
            activity.tss = require('../../custom_modules/activity/tss')(activity.fc_moyenne, activity.moving_time, fcMax)
          })
        }

        // filter activities array
        if (req.query.start_date && req.query.end_date && dbActivites.length >= 1) {
          var date = {
            start: new Date(req.query.start_date),
            end: new Date(req.query.end_date)
          }

          var filtredActivities = dbActivites.filter((val) => {
            var activityDate = new Date(val.start_date_local)
            if (activityDate >= date.start && activityDate <= date.end) {
              return val
            }
          })

          dbActivites = filtredActivities
        }

        res.render('partials/activity/overview', { activities: dbActivites })
      })
  }
}

module.exports = activityCtrl
