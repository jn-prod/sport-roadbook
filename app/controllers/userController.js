var strava = require ('../../custom_modules/strava')
var User = require('../models/user')

//Controllers
var userCtrl = {
  login : (req, res) => {
    if(req.user) {
      res.redirect('/user/' + user.id)
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
    if (req.session.user) {
      strava.code = req.session.strava
      strava.athlete.activities.get((err, activites) => {
        var activites = activites
        res.render('partials/user/home', {activites: activites})
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