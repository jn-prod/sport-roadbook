// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var activityCtrl = require('../controllers/activityController')
var authenticated = require('../../custom_modules/authenticate')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', authenticated, activityCtrl.getAddActivity)
// post add activity form
router.post('/add', authenticated, activityCtrl.postAddActivity)
// get all strava activities
router.get('/get/:user/strava/all', authenticated, activityCtrl.getStravaActivities)
// delete activities
router.get('/:activity/delete', authenticated, activityCtrl.deleteActivitiy)
// activitie overview
router.get('/:activity', authenticated, activityCtrl.activitiyDetail)
// activities import
router.get('/import', authenticated, activityCtrl.getImport)

module.exports = router
