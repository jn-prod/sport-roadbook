// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var healthCtrl = require('../controllers/healthController')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', healthCtrl.getAddStatus)
// post add activity form
router.post('/add', healthCtrl.postAddStatus)
// view activitie score
router.get('/:id', healthCtrl.getHealthScoreView)

// activities score overview
router.get('/:user/overview', healthCtrl.healthOverview)

// data activitie score
router.get('/data/:id', healthCtrl.getHealthScoreData)

module.exports = router
