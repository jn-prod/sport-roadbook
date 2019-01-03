// node_modules
var Promise = require('bluebird')

var dateNow = new Date(Date.now())

// custom_modules
var getHealthScore = require('../../custom_modules/health/healthScore')

// models
var User = require('../models/user')
var Activity = require('../models/activity')
var Event = require('../models/event')

var activityTranslate = (activity) => {
  if (activity === 'Run') {
    return 'Course à pied'
  } else if (activity === 'Hike') {
    return 'Marche'
  } else if (activity === 'Ride') {
    return 'Velo'
  } else {
    return activity
  }
}

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
    var dateOfBirth
    if (form.date_of_birth) {
      try {
        dateOfBirth = new Date(Date.parse(form.date_of_birth))
      } catch (err) {
        if (err) {
          dateOfBirth = null
        }
      }
    } else {
      dateOfBirth = null
    }

    User
      .findByIdAndUpdate(req.session.user._id, {
        $set: {
          firstname: form.firstname,
          lastname: form.lastname,
          sex: form.sex,
          country: form.country,
          city: form.city,
          date_of_birth: dateOfBirth,
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
    var userId = req.params.user
    var config = {
      owner: String(req.params.user) === String(req.session.user._id)
    }

    // request user
    if (req.session.user) {
      // request db events
      var dbEventsNext = new Promise((resolve, reject) => {
        Event
          .find({ 'user': userId, 'date_start': { $gte: dateNow } })
          .sort({ date_start: -1 })
          .exec((err, event) => {
            if (err) {
              reject(err)
            }
            if (event.length > 0) {
              resolve(event[0])
            } else {
              resolve(false)
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
          .exec((err, dbActivites) => {
            var countActivities = {
              hike: 0,
              ride: 0,
              run: 0
            }
            if (err) {
              reject(err)
            }
            if (dbActivites !== undefined && dbActivites.length >= 1) {
              dbActivites.forEach((activity) => {
                if (activity.type === 'Ride') {
                  countActivities.ride += 1
                } else if (activity.type === 'Hike') {
                  countActivities.hike += 1
                } else if (activity.type === 'Run') {
                  countActivities.run += 1
                }

                // translate activity
                activity.type = activityTranslate(activity.type)
              })
            }

            resolve({ list: dbActivites, count: countActivities })
          })
      })

      // promise all requests
      Promise
        .props({
          activities: dbActivitiesAll,
          event: dbEventsNext,
          profil: dbUser
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
          // if (api.profil.date_of_birth && (api.profil.sex === 'M' || api.profil.sex === 'W') && Number(api.profil.height) > 0 && Number(api.health.poids) > 0 && api.health.created_at) {
          //   try {
          //     api.weight_analyse = require('../../custom_modules/health/healthWeightAnalyse')(Number(api.health.poids), Number(api.profil.height), api.profil.date_of_birth, api.health.created_at, api.profil.sex)
          //   } catch (err) {
          //     if (err) throw err
          //   }
          // }

          api.date_now = dateNow
          api.config = config
          res.render('partials/user/home', api)
        })
        .catch((err) => {
          if (err) {
            console.log(err)
            res.redirect('/user/login')
          }
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
