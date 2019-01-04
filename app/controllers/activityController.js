// models
var Activity = require('../models/activity')
// var today = new Date(Date.now())

var checkboxToBoolean = (value) => {
  if (value === 'on' || value === 'true') {
    return true
  } else {
    return false
  }
}

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
    form.competition = checkboxToBoolean(form.competition)
    form.import = true

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
      token: req.session.user.strava_refresh_token,
      api: require('../../custom_modules/strava/stravaGetUserActivities')
    }

    if (strava.token !== null || strava.token !== undefined) {
      try {
        strava.api(strava.token, (stravaActivities) => {
          if (stravaActivities.length >= 1) {
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
                      user_fc_max: stravaActivity.max_heartrate,
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
          }
        })
      } catch (err) {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }
      }
    }
    // finale redirection
    res.redirect('/user/' + req.session.user._id)
  },
  deleteActivitiy: (req, res) => {
    Activity
      .findById(req.params.activity)
      .populate('user')
      .exec((err, activity) => {
        if (err) throw err
        if (String(activity.user._id) === String(req.session.user._id)) {
          Activity
            .findByIdAndUpdate(req.params.activity, { $set: { user: null } }, (err, doc) => {
              if (err) throw err
              // finale redirection
              res.redirect('/user/' + req.session.user._id)
            })
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  getImport: (req, res) => {
    res.render('partials/activity/import')
  },
  activitiyDetail: (req, res) => {
    // request db Activities
    Activity
      .findById(req.params.activity)
      .populate('user')
      .exec((err, dbActivity) => {
        var config = {
          user_owner: String(dbActivity.user._id) === String(req.session.user._id),
          user_fc_max: false,
          activity_full_data: false
        }

        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        if (dbActivity !== undefined) {
          // all activity data for next step ?
          if (dbActivity.moving_time * 1 > 0 && dbActivity.fc_moyenne * 1 > 0) {
            config.activity_full_data = true
          }

          if (config.activity_full_data) {
            // calcul de la fc max du user
            if (dbActivity.user.fc_max > 0) {
              config.user_fc_max = dbActivity.user.fc_max
            } else if ((dbActivity.user.fc_max === null || dbActivity.user.fc_max === undefined) && dbActivity.user.date_of_birth !== null) {
              var birthdate = new Date(dbActivity.user.date_of_birth)
              var dateNow = new Date(Date.now())

              try {
                config.user_fc_max = 220 - (dateNow.getFullYear() - birthdate.getFullYear())
              } catch (err) {
                if (err) {
                  config.user_fc_max = false
                }
              }
            }

            // calcul de la mesure de l'effort - tss
            if (config.user_fc_max > 0) {
              try {
                dbActivity.tss = require('../../custom_modules/activity/tss')(dbActivity.fc_moyenne, dbActivity.moving_time, config.user_fc_max)
              } catch (err) {
                if (err) {
                  dbActivity.tss = 'NC'
                }
              }
            }
          }
        }

        // render page
        res.render('partials/activity/details', { activity: dbActivity, config: config })
      })
  }
}

module.exports = activityCtrl
