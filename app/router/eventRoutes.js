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
// details event
router.get('/:event', eventCtrl.eventDetails)
// delete event
router.get('/:event/delete', eventCtrl.deleteEvent)
module.exports = router
