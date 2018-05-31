// models
var User = require('../models/user')
var Health = require('../models/health')

//Controllers
var healthCtrl = {
  getAddStatus: (req, res) => {
    if (req.session.user) {
      Health
        .find({user: req.session.user._id})
        .sort( {"created_at": -1} )
        .limit(1)
        .exec((err, dbHealth) => {
          var lastHealth = dbHealth[0]
          res.render('partials/health/add', {lastHealth: lastHealth})
        })
    } else {
      res.redirect('/user/login')
    }
  },
  postAddStatus: (req, res) => {
    var form = req.body
    form.user = res.locals.user._id
    var newHealth = new Health(form)
    newHealth.save((err, health) => {
      if (err) throw err
      else {
        res.redirect('/user/' + req.session.user._id)                   
      }
    })
  }
}

module.exports = healthCtrl