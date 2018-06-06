// models
var User = require('../models/user')
var Health = require('../models/health')

// custom_modules
var getHealthScore = require('../../custom_modules/health/healthScore')
var getHealthRisk = require('../../custom_modules/health/healthRisk')

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
        res.redirect('/health/' + health._id)                   
      }
    })
  },
  getHealthScoreView: (req, res) => {
    Health
      .findOne({_id: req.params.id})
      .exec((err, healthDetail) => {
        var score = getHealthScore(healthDetail)
        var healthRisk = getHealthRisk(healthDetail)
        var healthStatus = {
          health_detail: healthDetail,
          health_Score: score,
          health_risk: healthRisk
        }
        console.log(healthStatus.health_risk)
        res.render('partials/health/view', healthStatus)
      })
  },
  getHealthScoreData: (req, res) => {
    Health
      .findOne({_id: req.params.id})
      .select({ _id: 0, sommeil: 1, recuperation: 1, lassitude: 1, humeur: 1,  stress:1 })
      .exec((err, healthDetail) => {
        var score = getHealthScore(healthDetail)
        var healthStatus = {
          health_detail: healthDetail,
          health_Score: score
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.send(JSON.stringify(healthStatus))
      })
  }
}

module.exports = healthCtrl