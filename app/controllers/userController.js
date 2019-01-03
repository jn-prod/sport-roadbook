// node_modules
var Promise = require('bluebird')

var dateNow = new Date(Date.now())

// models
var User = require('../models/user')
var Activity = require('../models/activity')
var Event = require('../models/event')
var Team = require('../models/team')

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

      // request db user
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

      // request db teams
      var dbTeam = new Promise((resolve, reject) => {
        Team
          .find({ membres: userId })
          .limit(5)
          .exec((err, team) => {
            if (err) {
              reject(err)
            }
            resolve(team)
          })
      })

      // request db coach
      var dbCoach = new Promise((resolve, reject) => {
        Team
          .find({ coach: userId })
          .limit(5)
          .exec((err, team) => {
            if (err) {
              reject(err)
            }
            resolve(team)
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
          team: dbTeam,
          coach: dbCoach,
          profil: dbUser
        })
        .then((result) => {
          var api = result

          if (api.coach.length >= 1) {
            config.coach = true
          } else {
            config.coach = false
          }

          if (api.team.length >= 1) {
            config.team = true
          } else {
            config.team = false
          }

          if (api.team.length >= 1 || api.coach.length >= 1) {
            config.team_load_more = true
          } else {
            config.team_load_more = false
          }

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
