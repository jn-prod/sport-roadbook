// models
var Activity = require('../models/activity')
var Event = require('../models/event')
// var today = new Date(Date.now())

var convertTime = require('../../custom_modules/tools/convert-time').toNumber

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
  getJoinSelectEvent: (req, res) => {
    var config = {
      title: 'Quel est l\'événement correspondant à cette activité ?',
      section: 'L\'événement pour cette activité n\'a pas encore été créer ?',
      link: 'activities/' + req.params.activity
    }

    Event
      .find({ user: req.session.user._id })
      .exec((err, events) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        if (String(req.session.user._id) === String(events[0].user._id)) {
          res.render('partials/event/join', { events: events, config: config })
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  getJoinEvent: (req, res) => {
    Activity
      .findById(req.params.activity)
      .exec((err, activity) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        if (String(req.session.user._id) === String(activity.user._id)) {
          Activity
            .findByIdAndUpdate(req.params.activity, { $set: { event: req.params.event } }, (err, activity) => {
              if (err) {
                res.redirect('/user/' + req.session.user._id)
              }
              res.redirect('/event/' + req.params.event)
            })
        } else {
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

        var tss = require('../../custom_modules/activity/tss')(dbActivity, config)

        // render page
        res.render('partials/activity/details', tss)
      })
  }
}

module.exports = activityCtrl
