var strava = require ('../../custom_modules/strava')
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')
var Promise = require('bluebird')
var moment = require('moment')

var groupByDate = (activities, filter) => {
  return activities.reduce(function (acc, date) {
    var yearWeek = moment(date[filter]).year() + '-' + moment(date[filter]).week()

    if(!acc[yearWeek]){
      acc[yearWeek] = []
    }
    acc[yearWeek].push({date})
    return acc
  }, {})
}

var reducer = (accumulator, currentValue) => accumulator + currentValue;

var getHealthScore = (val) => {
  var markeurs = [val.humeur, val.sommeil, val.lassitude, val.recuperation, val.stress, val.faim, val.soif]
  var score = markeurs.reduce(reducer)
  var highScore = markeurs.length * 5

  var dayScore = score / highScore * 100
  return dayScore
}

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
            'email': data.email
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
                    res.redirect('/user/' + newUser._id)                   
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
  facebookCallback: (err, user, info) => {
    console.log(res)
    res.redirect('/')
  },
  home: (req, res) => {
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
        if (element.health) {
          element.healthScore = getHealthScore(element.health)
        } else {
          element.healthScore = ''
        }
        return element
      })
      .then((result) => {
        var api = result   
        var activitiesByDate = groupByDate(api.activities, "start_date_local")
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
        res.render('partials/user/home', api)
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