// node_modules
var Promise = require('bluebird')
var moment = require('moment')
var passport = require('passport')

// custom_modules
var domainUrl = require('../../custom_modules/domain-check')
var getHealthScore = require('../../custom_modules/health/healthScore')

// models
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')

// controllers functions
var groupByDate = (activities, filter) => {
  return activities.reduce(function (acc, date) {
    var yearWeek = moment(date[filter]).year() + '-' + moment(date[filter]).week()

    if (!acc[yearWeek]) {
      acc[yearWeek] = []
    }
    acc[yearWeek].push({date})
    return acc
  }, {})
}

// Controllers
var userCtrl = {
  login: (req, res) => {
    if (req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      var login = true
      res.render('partials/user/login', {login: login})
    }
  },
  logout: (req, res) => {
    req.session = null
    req.logout()
    res.redirect('/')
  },
  delete: (req, res) => {
    User.deleteOne({ _id: req.session.user._id }, (err) => {
      if (err) {
        res.redirect('/user/' + req.session.user._id)
      } else {
        req.session = null
        req.logout()
        res.redirect('/user/login')
      }
    })
  },
  home: (req, res) => {
    // request user
    if (req.session.user) {
      // request Strava
      var stravaId = req.session.user.strava_id
      var stravaCode = req.session.strava
      var stravaApi = require('../../custom_modules/strava/stravaGetUserActivities')

      var stravaAll = new Promise((resolve, reject) => {
        if (stravaId && stravaCode) {
          stravaApi(stravaId, stravaCode, (done) => {
            resolve(done)
          })
        } else {
          resolve('')
        }
      })
      // request db Activities
      var dbActivitiesAll = new Promise((resolve, reject) => {
        Activity
          .find({user: req.session.user._id})
          .exec((err, dbActivites) => {
            resolve(dbActivites)
          })
      })

      // request db Health
      var dbHealthAll = new Promise((resolve, reject) => {
        Health
          .find({user: req.session.user._id})
          .sort({'created_at': -1})
          .limit(1)
          .exec((err, dbHealth) => {
            resolve(dbHealth[0])
          })
      })

      var dateNow = new Date(Date.now())

      // promise all requests
      Promise.props({
        strava: stravaAll,
        activities: dbActivitiesAll,
        health: dbHealthAll
      })
        .then((val) => {
        // skip health form
          if (req.query.skip === 'true') {
            return val
          } else {
          // if no score today request it
            if (val.health !== undefined) {
              var lastDate = val.health.created_at
              if (lastDate) {
                if ((lastDate.getFullYear() + '-' + lastDate.getMonth() + '-' + lastDate.getDate()) !== (dateNow.getFullYear() + '-' + dateNow.getMonth() + '-' + dateNow.getDate())) {
                  res.redirect('/health/add')
                } else {
                  return val
                }
              } else {
                res.redirect('/health/add')
              }
            } else {
              res.redirect('/health/add')
            }
          }
        })
        .then((val) => {
          var allActivities = []

          // check if strava array isn't null
          if (val.strava.length >= 1) {
            val.strava.forEach((val) => {
              allActivities.push(val)
            })
          }
          // check if activities array isn't null
          if (val.activities.length >= 1) {
            val.activities.forEach((val) => {
              allActivities.push(val)
            })
          }

          allActivities.sort((a, b) => {
            return new Date(b.start_date_local) - new Date(a.start_date_local)
          })

          return {activities: allActivities, health: val.health}
        })
        .then((val) => {
          var element = val

          // health score calcul
          if (element.health) {
            element.healthScore = getHealthScore(element.health)
          } else {
            element.healthScore = ''
          }
          return element
        })
        .then((result) => {
          var api = result

          // charge calcul if activities array isn't null
          if (api.activities.length >= 1) {
            var activitiesByDate = groupByDate(api.activities, 'start_date_local')
            var activitesByDateFormated = []

            Object
              .values(activitiesByDate)
              .slice(0, 5)
              .reverse()
              .forEach((val) => {
                activitesByDateFormated.push({activities: val})
              })
            activitesByDateFormated.forEach((val, key) => {
              val.week = 'S' + moment(val.activities[0].date.start_date_local).week() + '-' + moment(val.activities[0].date.start_date_local).year()
            })
            api.charge = activitesByDateFormated
          }

          // filter activities array
          if (req.query.start_date && req.query.end_date && api.activities.length >= 1) {
            var date = {
              start: new Date(req.query.start_date),
              end: new Date(req.query.end_date)
            }

            var filtredActivities = api.activities.filter((val) => {
              var activityDate = new Date(val.start_date_local)
              if (activityDate >= date.start && activityDate <= date.end) {
                return val
              }
            })

            api.activities = filtredActivities
          }
          res.render('partials/user/home', api)
        })
    } else {
      res.redirect('/user/login')
    }
  }
}

module.exports = userCtrl
