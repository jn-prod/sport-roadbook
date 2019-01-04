// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var healthCtrl = require('../controllers/healthController')
var authenticated = require('../../custom_modules/authenticate')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', authenticated, healthCtrl.getAddStatus)
// post add activity form
router.post('/add', authenticated, healthCtrl.postAddStatus)
// view activitie score
router.get('/:id', authenticated, healthCtrl.getHealthScoreView)

// activities score overview
router.get('/:user/overview', authenticated, healthCtrl.healthOverview)

// data activitie score
router.get('/data/:id', authenticated, healthCtrl.getHealthScoreData)

module.exports = router
