// models
var User = require('../../app/models/user')

// custom_modules
var domainUrl = require('../domain-check')

// middleware start
var token = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: domainUrl + '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}

var accessResponse = (accessToken, refreshToken, profile, done) => {
  User
    .find({
      'email': profile._json.email
    })
    .limit(1)
    .exec((err, userFacebook) => {
      if (err) {
        return done(err)
      } else {
        if (userFacebook.length === 0) {
          var user = new User({
            facebook_id: profile._json.id,
            email: profile._json.email,
            firstname: profile._json.name.split(' ')[0],
            lastname: profile._json.name.split(' ')[1]
          })
          user.save((err, newUser) => {
            if (err) throw err
            else {
              done(null, newUser)
            }
          })
        } else {
          if (!userFacebook[0].facebook_id) {
            User.updateOne({ _id: userFacebook[0]._id }, { $set: { 'facebook_id': profile._json.id } }, (err, user) => {
              if (err) {
                return done(err)
              } else {
                done(null, userFacebook[0])
              }
            })
          } else {
            done(null, userFacebook[0])
          }
        }
      }
    })
}

module.exports.token = token

module.exports.accessResponse = accessResponse
