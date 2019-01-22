// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var resultCtrl = require('../controllers/resultController')
var authenticated = require('../../custom_modules/authenticate')

// // ---------------- INDEX ----------------
// get add result form
router.get('/add', authenticated, resultCtrl.getJoinEvent)
// get add result form
router.get('/event/:event/add', authenticated, resultCtrl.getAddEventResult)
// post add result form
router.post('/event/:event/add', authenticated, resultCtrl.postAddEventResult)
// // activities overview
// router.get('/:user/overview', authenticated, resultCtrl.eventsOverview)
// // details event
// router.get('/:event', authenticated, resultCtrl.eventDetails)
// // delete event
// router.get('/:event/delete', authenticated, resultCtrl.deleteEvent)
module.exports = router
