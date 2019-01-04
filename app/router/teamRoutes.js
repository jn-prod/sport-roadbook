// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var teamCtrl = require('../controllers/teamController')
var authenticated = require('../../custom_modules/authenticate')

// ---------------- INDEX ----------------
// get add team form
router.get('/add', authenticated, teamCtrl.getAddTeam)
// post add team form
router.post('/add', authenticated, teamCtrl.postAddTeam)
// team details
router.get('/:team', authenticated, teamCtrl.teamDetails)
// add event
router.get('/:team/event/:event/add', authenticated, teamCtrl.teamAddEvent)
// add membre validation
router.post('/:team/membre/add', authenticated, teamCtrl.teamAddMember)
// team overview
router.get('/:user/overview', authenticated, teamCtrl.teamOverview)
// delete team
router.get('/:team/delete', authenticated, teamCtrl.deleteTeam)

module.exports = router
