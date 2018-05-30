var express = require('express'),
    router = express.Router();
//Controllers
var passport = require('passport')

//Controllers
var cmsCtrl = require('../controllers/cmsController')
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', cmsCtrl.index);
// Get Mentions Légales
router.get('/mentions-legales', cmsCtrl.mentionsLegales);

// Redirect the user to Facebook for authentication
//{scope: ["public_profile","email"]};
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ["public_profile","email"] } ) );//userCtrl.facebookRequest
// Get  facebook AUTH
router.get('/auth/facebook/callback', userCtrl.facebookResponse)

module.exports = router;