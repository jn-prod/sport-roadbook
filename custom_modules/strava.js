// models
var User = require('../app/models/user')

// custom_modules
var domainUrl = require('./domain-check')

var stravaApi = (token) => {
  var strava = new require("strava") ({
    client_id: process.env.STRAVA_ID, 
    client_secret: process.env.STRAVA_SECRET,
    redirect_uri: domainUrl,
    access_token: token
  });
  return strava
}

// middleware start
var token = {
  clientID: process.env.STRAVA_ID, 
  clientSecret: process.env.STRAVA_SECRET,
  redirect_uri: domainUrl,
  access_token: process.env.STRAVA_ACCESS
}

var accessResponse = (accessToken, refreshToken, profile, done) => {
  User
    .find({
      'email': profile._json.email
    })
    .limit(1)
    .exec((err, userStrava) => {
      if (err) {
        return done(err)
      } else {
        if(userStrava.length === 0) {
          var user = new User({
              strava_id: profile._json.id,
              username: profile._json.username,
              email: profile._json.email,
              firstname: profile._json.firstname,
              lastname : profile._json.lastname,
              sex: profile._json.sex,
              country: profile._json.country,
              city: profile._json.city
          })
          user.save((err, newUser) => {
            if (err) throw err
            else {
              done(null, newUser)              
            }
          })
        } else {
          if(!userStrava[0].Strava_id) {
            User.updateOne({ _id: userStrava[0]._id}, {$set : {'strava_id': profile._json.id} }, (err, user) => {
              if(err) {
                return done(err)
              } else {
                done(null, userStrava[0])
              }
            })
          } else {
            done(null, userStrava[0])
          }
        }
      }
    })
}

module.exports.token = token

module.exports.accessResponse = accessResponse

module.exports.stravaApi = stravaApi