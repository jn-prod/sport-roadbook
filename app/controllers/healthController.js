var User = require('../models/user')
var Health = require('../models/health')

//Controllers
var healthCtrl = {
  getAddStatus: (req, res) => {
    if (req.session.user) {
      res.render('partials/health/add')
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