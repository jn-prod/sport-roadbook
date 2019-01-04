// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var eventCtrl = require('../controllers/eventController')
var authenticated = require('../../custom_modules/authenticate')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', authenticated, eventCtrl.getAddEvent)
// post add activity form
router.post('/add', authenticated, eventCtrl.postAddEvent)
// activities overview
router.get('/:user/overview', authenticated, eventCtrl.eventsOverview)
// details event
router.get('/:event', authenticated, eventCtrl.eventDetails)
// delete event
router.get('/:event/delete', authenticated, eventCtrl.deleteEvent)
module.exports = router
