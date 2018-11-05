// node_modules
var Promise = require('bluebird')

// custom_modules
var getHealthScore = require('../../custom_modules/health/healthScore')

// models
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')

// Controllers
var userCtrl = {
  login: (req, res) => {
    if (req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      var login = true
      res.render('partials/user/login', { login: login })
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
    var getWeekNumber = (d) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
      return weekNo
    }

    var userId = req.params.user

    var dateNow = new Date(Date.now())

    // request user
    if (req.session.user) {
      // request db Health
      var dbHealthAll = new Promise((resolve, reject) => {
        Health
          .find({ user: userId })
          .sort({ 'created_at': -1 })
          .limit(1)
          .exec((err, dbHealth) => {
            var health = dbHealth[0]
            if (err) {
              reject(err)
            }

            // if no score today request it
            if (dbHealth.length > 0 || req.query.skip === 'true') {
              var lastDate = health.created_at.getFullYear() + '-' + health.created_at.getMonth() + '-' + health.created_at.getDate()
              var today = dateNow.getFullYear() + '-' + dateNow.getMonth() + '-' + dateNow.getDate()
              if (lastDate === today || req.query.skip === 'true') {
                resolve(health)
              } else {
                res.redirect('/health/add')
              }
            } else {
              res.redirect('/health/add')
            }
          })
      })

      // request db Activities
      var dbActivitiesAll = new Promise((resolve, reject) => {
        Activity
          .find({ user: userId })
          .sort({ 'start_date_local': -1 })
          .exec((err, dbActivites) => {
            if (err) {
              reject(err)
            }

            dbActivites.forEach((val) => {
              // calcul du TSS
              if (val.moving_time * 1 > 0 && val.fc_moyenne * 1 > 0) {
                val.tss = 'NC'
              } else {
                val.tss = 'NC'
              }
            })
            resolve(dbActivites)
          })
      })

      var dbCharge = new Promise((resolve, reject) => {
        Activity
          .aggregate([
            {
              $match: { user: require('mongoose').Types.ObjectId(userId) }
            }, {
              $project: {
                'activity_date': {
                  week: { $week: '$start_date_local' },
                  year: { $year: '$start_date_local' }
                },
                'dailyDuration': '$moving_time'
              }
            }, {
              $group: {
                _id: '$activity_date',
                count: { $sum: 1 },
                'weeklyDuration': { $sum: '$dailyDuration' }
              }
            }
          ])
          .sort({ '_id.year': -1, '_id.week': -1 })
          .limit(10)
          .exec((err, docs) => {
            if (err) {
              reject(err)
            }

            var finalActivitiesCharge = []
            var currentWeekNum = getWeekNumber(new Date(Date.now()))

            for (var i = 0; i < 10; i++) {
              finalActivitiesCharge.push({
                week: (currentWeekNum * 1) - i,
                text: 'S' + (currentWeekNum - i) + '-' + (new Date()).getFullYear(),
                count: 0,
                weeklyDuration: 0
              })
            }

            docs.forEach((dbVal) => {
              finalActivitiesCharge.forEach((finalVal) => {
                if (finalVal.week === (dbVal._id.week + 1)) {
                  finalVal.count = dbVal.count
                  finalVal.weeklyDuration = dbVal.weeklyDuration
                }
              })
            })

            finalActivitiesCharge.reverse()
            resolve(finalActivitiesCharge)
          })
      })

      // promise all requests
      Promise
        .props({
          activities: dbActivitiesAll,
          health: dbHealthAll,
          charge: dbCharge
        })
        .then((val) => {
          // health score calcul
          if (val.health) {
            val.healthScore = getHealthScore(val.health)
          } else {
            val.healthScore = ''
          }
          return val
        })
        .then((result) => {
          var api = result

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
  },
  wait: (req, res) => {
    res.render('partials/user/wait')
  }
}

module.exports = userCtrl
