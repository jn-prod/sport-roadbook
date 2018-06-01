// node_modules
var express = require('express'),
    router = express.Router();
var passport = require('passport')

// Controllers
var authCtrl = require('../controllers/authController')

// ---------------- INDEX ----------------

// Redirect the user to Facebook for authentication
router.get('/facebook', authCtrl.facebookRequest );//userCtrl.facebookRequest
// Get  facebook AUTH
router.get('/facebook/callback', authCtrl.facebookResponse)

// strava
// Redirect the user to strava for authentication
router.get('/strava', authCtrl.stravaRequest );
// Get strava auth
router.get('/strava/callback', authCtrl.stravaResponse);

module.exports = router;