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

  }
}

module.exports = healthCtrl