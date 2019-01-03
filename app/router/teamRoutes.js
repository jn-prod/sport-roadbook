// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var teamCtrl = require('../controllers/teamController')

// ---------------- INDEX ----------------
// get add team form
router.get('/add', teamCtrl.getAddTeam)
// post add team form
router.post('/add', teamCtrl.postAddTeam)
// team details
router.get('/:team', teamCtrl.teamDetails)
// add event
router.get('/:team/event/:event/add', teamCtrl.teamAddEvent)
// add membre validation
router.post('/:team/membre/add', teamCtrl.teamAddMember)
// team overview
router.get('/:user/overview', teamCtrl.teamOverview)
// delete team
router.get('/:team/delete', teamCtrl.deleteTeam)

module.exports = router
