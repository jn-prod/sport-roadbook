// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var cmsCtrl = require('../controllers/cmsController')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', cmsCtrl.index)
// Get Mentions Légales
router.get('/mentions-legales', cmsCtrl.mentionsLegales)

module.exports = router
