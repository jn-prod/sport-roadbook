// node_modules
var request = require('request')
// models
var Health = require('../models/health')
// custom_modules
var getHealthScore = require('../../custom_modules/health/healthScore')
var getHealthRisk = require('../../custom_modules/health/healthRisk')
var getMeteoByCoordonnees = require('../../custom_modules/openweathermap/getMeteoByCoordonnees')

// Controllers
var healthCtrl = {
  getAddStatus: (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (req.session.user) {
      Health
        .find({user: req.session.user._id})
        .sort({'created_at': -1})
        .limit(1)
        .exec((err, dbHealth) => {
          if (err) throw err
          var lastHealth = dbHealth[0]
          res.render('partials/health/add', {lastHealth: lastHealth, ip: ip})
        })
    } else {
      res.redirect('/user/login')
    }
  },
  postAddStatus: (req, res) => {
    var form = req.body
    form.user = res.locals.user._id

    // get IP
    var userIp = req.body.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (process.env.LOCAL) {
      userIp = process.env.IP
    }

    var apiIpUrl = 'http://api.ipapi.com/' + userIp + '?access_key=' + process.env.IPAPI_API_KEY

    // get LOCATION
    request(apiIpUrl, (error, response, body) => {
      if (error) {
        form.location = {latitude: null, longitude: null}
        res.redirect('/health/add')
      } else {
        var apiLocation = JSON.parse(body)
        form.location = {latitude: apiLocation.latitude, longitude: apiLocation.longitude}
      }

      // get METEO
      getMeteoByCoordonnees(form.location.latitude, form.location.longitude, (val) => {
        if (val !== null) {
          form.weather = val
        }

        // save HEALTH
        var newHealth = new Health(form)
        newHealth.save((err, health) => {
          if (err) throw err
          else {
            res.redirect('/health/' + health._id)
          }
        })
      })
    })
  },
  getHealthScoreView: (req, res) => {
    Health
      .findOne({_id: req.params.id})
      .exec((err, healthDetail) => {
        if (err) throw err
        if (String(req.session.user._id) === String(healthDetail.user)) {
          var score = getHealthScore(healthDetail)
          var healthRisk = getHealthRisk(healthDetail)
          var healthStatus = {
            health_detail: healthDetail,
            health_Score: score,
            health_risk: healthRisk
          }
          res.render('partials/health/view', healthStatus)
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  getHealthScoreData: (req, res) => {
    Health
      .findOne({_id: req.params.id})
      .select({ _id: 0, user: 1, sommeil: 1, recuperation: 1, lassitude: 1, humeur: 1, stress: 1 })
      .exec((err, healthDetail) => {
        if (err) throw err
        if (String(req.session.user._id) === String(healthDetail.user)) {
          var score = getHealthScore(healthDetail)
          var healthStatus = {
            health_detail: {
              sommeil: 0,
              recuperation: 0,
              lassitude: 0,
              humeur: 0,
              stress: 0
            },
            health_Score: score
          }

          healthStatus.health_detail.sommeil = healthDetail.sommeil
          healthStatus.health_detail.recuperation = healthDetail.recuperation
          healthStatus.health_detail.lassitude = healthDetail.lassitude
          healthStatus.health_detail.humeur = healthDetail.humeur
          healthStatus.health_detail.stress = healthDetail.stress

          res.setHeader('Access-Control-Allow-Methods', 'GET')
          res.send(JSON.stringify(healthStatus))
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  }
}

module.exports = healthCtrl
