var strava = require ('../../custom_modules/strava')
var User = require('../models/user')
var Activity = require('../models/activity')
var Health = require('../models/health')
var Promise = require('bluebird')
var moment = require('moment')

var callbackURL;
var passport = require('passport')

if (process.env.LOCAL) {
  callbackURL= "https://localhost:3000"
} else {
  callbackURL = "https://www.feezify.me"
}

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
  stravaRequest: (req,res) => {
    res.redirect('https://www.strava.com/oauth/authorize?client_id=' + process.env.STRAVA_ID + '&response_type=code&redirect_uri=' + callbackURL + '/user/auth/strava/callback&approval_prompt=force&scope=public')
  },
  stravaCallback: (req,res) => {
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
  facebookResponse: (req, res, next) => {
    passport.authenticate('facebook', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }

      req.session.user = user
      return res.redirect('/user/' + user.id);
    })(req, res, next);

  },
  home: (req, res) => {
    if (req.session.user) {
      // request Strava
      strava.code = req.session.strava
      var stravaAll = new Promise((resolve, reject) => {
        if(strava.code) {
          strava.athlete.activities.get((err, stravaActivities) => {
            resolve(stravaActivities)
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
        
        //check if strava array isn't null
        if(val.strava.length >= 1) {
          val.strava.forEach((val) => {
            allActivities.push(val)
          })          
        }
        //check if activities array isn't null
        if(val.activities.length >= 1) {
          val.activities.forEach((val) =>  {
            allActivities.push(val)
          })          
        }

        allActivities.sort((a,b )=> {
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
        if(api.activities.lentgh >= 1) {
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
        }

        res.render('partials/user/home', api)
      })

    } else {
      res.redirect('/user/login')
    }
  },
  logout: (req, res) => {
    req.session = null
    req.logout();
    res.redirect('/')
  }
}

module.exports = userCtrl