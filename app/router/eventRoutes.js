// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var eventCtrl = require('../controllers/eventController')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', eventCtrl.getAddEvent)
// post add activity form
router.post('/add', eventCtrl.postAddEvent)
// activities overview
router.get('/:user/overview', eventCtrl.eventsOverview)

module.exports = router
