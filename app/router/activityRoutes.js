// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var activityCtrl = require('../controllers/activityController')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', activityCtrl.getAddActivity)
// post add activity form
router.post('/add', activityCtrl.postAddActivity)
// get all strava activities
router.get('/get/:user/strava/all', activityCtrl.getStravaActivities)
// delete activities
router.get('/:activity/delete', activityCtrl.deleteActivitiy)

module.exports = router
