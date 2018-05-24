var strava = require ('../../custom_modules/strava')
var User = require('../models/user')

//Controllers
var userCtrl = {
  home : function(req, res){
    if (req.query.error === 'access_denied') {
      res.redirect('/')
    } else {
      strava.code = req.query.code
      strava.athlete.get(function(err, data) {
        console.log(data)
        res.render('partials/user/home', {data: data})
      });   
    }
  }
}

module.exports = userCtrl