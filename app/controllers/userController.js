var strava = require ('../../custom_modules/strava')
var User = require('../models/user')

//Controllers
var userCtrl = {
  home : (req, res) => {
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
                user.save((err, user) => {
                  if (err) throw err
                  else {
                    console.log('New user =>')
                    console.log(user)
                    req.session.user = user
                    res.render('partials/user/home')                    
                  }
                })
              } else {
                console.log('Exist user =>')
                console.log(userStrava)
                req.session.user = userStrava
                res.render('partials/user/home')
              }
            }
        })

      })
    }
  }
}

module.exports = userCtrl