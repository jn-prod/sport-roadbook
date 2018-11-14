// node_modules
var Promise = require('bluebird')

var dateNow = new Date(Date.now())

// custom_modules
var getHealthScore = require('../../custom_modules/health/healthScore')

// models
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')
var Event = require('../models/event')

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
  profil: (req, res) => {
    User
      .findById(req.session.user._id)
      .exec((err, user) => {
        if (err) {
          user = {}
        }

        res.render('partials/user/profil', { dbUser: user })
      })
  },
  getEdit: (req, res) => {
    User
      .findById(req.session.user._id)
      .exec((err, user) => {
        if (err) {
          user = {}
        }

        res.render('partials/user/edit', { dbUser: user })
      })
  },
  postEdit: (req, res) => {
    var form = req.body

    User
      .findByIdAndUpdate(req.session.user._id, {
        $set: {
          firstname: form.firstname,
          lastname: form.lastname,
          sex: form.sex,
          country: form.country,
          city: form.city,
          date_of_birth: new Date(Date.parse(form.date_of_birth)),
          fc_max: Number(form.fc_max),
          height: Number(form.height),
          updated_at: String(dateNow) }
      }, {
        upsert: true
      }, (err, doc) => {
        if (err) throw err
        res.redirect('/user/' + req.session.user._id + '/profil')
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

    // request user
    if (req.session.user) {
      // request db Health
      var dbHealthAll = new Promise((resolve, reject) => {
        Health
          .find({ user: userId })
          .sort({ 'created_at': -1 })
          .limit(1)
          .exec((err, dbHealth) => {
            var health
            if (err) {
              reject(err)
            }

            if (dbHealth.length > 0) {
              health = dbHealth[0]
            } else {
              health = {}
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

      // request db events
      var dbEventsNext = new Promise((resolve, reject) => {
        Event
          .find({ 'user': userId, 'date_start': { $gte: dateNow } })
          .sort({ date_start: -1 })
          .limit(1)
          .exec((err, event) => {
            if (err) {
              reject(err)
            }
            if (event.length > 0) {
              resolve(event[0])
            } else {
              resolve({})
            }
          })
      })

      // request db events
      var dbUser = new Promise((resolve, reject) => {
        User
          .findById(userId)
          .exec((err, user) => {
            if (err) {
              reject(err)
            }
            resolve(user)
          })
      })

      // request db Activities
      var dbActivitiesAll = new Promise((resolve, reject) => {
        Activity
          .find({ user: userId })
          .sort({ 'start_date_local': -1 })
          .limit(1)
          .exec((err, dbActivites) => {
            if (err) {
              reject(err)
            }

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

            if (docs.length > 0) {
              docs.forEach((dbVal) => {
                finalActivitiesCharge.forEach((finalVal) => {
                  if (finalVal.week === (dbVal._id.week + 1)) {
                    finalVal.count = dbVal.count
                    finalVal.weeklyDuration = dbVal.weeklyDuration
                  }
                })
              })
              finalActivitiesCharge.reverse()
            }

            resolve(finalActivitiesCharge)
          })
      })

      // promise all requests
      Promise
        .props({
          activities: dbActivitiesAll,
          health: dbHealthAll,
          charge: dbCharge,
          event: dbEventsNext,
          user: dbUser
        })
        .then((val) => {
          // health score calcul
          if (val.health) {
            try {
              val.healthScore = getHealthScore(val.health)
            } catch (err) {
              if (err) {
                val.healthScore = ''
              }
            }
          } else {
            val.healthScore = ''
          }
          return val
        })
        .then((result) => {
          var api = result

          // IMG & IMG
          if (api.user.date_of_birth && (api.user.sex === 'M' || api.user.sex === 'W') && Number(api.user.height) > 0 && Number(api.health.poids) > 0 && api.health.created_at) {
            try {
              api.weight_analyse = require('../../custom_modules/health/healthWeightAnalyse')(Number(api.health.poids), Number(api.user.height), api.user.date_of_birth, api.health.created_at, api.user.sex)
            } catch (err) {
              if (err) throw err
            }
          }

          api.date_now = dateNow
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
