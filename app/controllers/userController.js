var strava = require ('../../custom_modules/strava')
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')
var Promise = require("bluebird");

//Controllers
var userCtrl = {
  login : (req, res) => {
    if(req.session.user) {
      res.redirect('/user/' + req.session.user._id)
    } else {
      var login = true
      res.render('partials/user/login', {login: login})
    }
  },
  stravaAuth: (req,res) => {
    if (req.query.error === 'access_denied') {
      res.redirect('/')
    } else {
      req.session.strava = strava.code = req.query.code
      // strava API call athlete
      strava.athlete.get((err, data) => {
        // DB User find or create
        User
          .find({
            'strava_id': data.id
          })
          .limit(1)
          .exec((err, userStrava) => {
            if (err) {
              throw err
            } else {
              if(userStrava.length === 0) {
                var user = new User({
                    strava_id: data.id,
                    username: data.username,
                    email: data.email,
                    firstname: data.firstname,
                    lastname : data.lastname,
                    sex: data.sex,
                    country: data.country,
                    city: data.city
                })
                user.save((err, newUser) => {
                  if (err) throw err
                  else {
                    req.session.user = newUser
                    res.redirect('/user/' + newUser.id)                   
                  }
                })
              } else {
                req.session.user = userStrava[0]
                res.redirect('/user/' + userStrava[0].id)
              }
            }
        })
      })
    }
  },
  home: (req, res) => {
    function getHealthScore (val) {
      var reducer = (accumulator, currentValue) => accumulator + currentValue
      var markeurs = [val.humeur, val.sommeil, val.lassitude, val.recuperation, val.stress, val.faim, val.soif]
      var score = markeurs.reduce(reducer)
      var highScore = markeurs.length * 5

      var dayScore = score / highScore * 100
      return dayScore
    }

    if (req.session.user) {
      // request Strava
      strava.code = req.session.strava
      var stravaAll = new Promise((resolve, reject) => {
        strava.athlete.activities.get((err, stravaActivities) => {
          resolve(stravaActivities)
        })
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
          .sort( {"created_at": -1} )
          .limit(1)
          .exec((err, dbHealth) => {
            resolve(dbHealth[0])
          })
      })

      // promise all requests
      Promise.props({
        strava : stravaAll,
        activities: dbActivitiesAll,
        health: dbHealthAll
      })
      .then((val) => {
        var allActivities = []
        val.strava.forEach((val) => {
          allActivities.push(val)
        })
        val.activities.forEach((val) =>  {
          allActivities.push(val)
        })
        allActivities.sort((a,b )=> {
          return new Date(b.start_date_local) - new Date(a.start_date_local)
        })
        return {activities: allActivities, health: val.health}
      })
      .then((val) => {
        var element = val
        element.healthScore = getHealthScore(element.health)
        return element
      })
      .then((result) => {
        res.render('partials/user/home', result)
      })

    } else {
      res.redirect('/user/login')
    }
  },
  logout: (req, res) => {
    req.session = null
    res.redirect('/')
  }
}

module.exports = userCtrl