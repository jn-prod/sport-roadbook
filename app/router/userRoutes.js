var express = require('express'),
    router = express.Router();
var passport = require('passport')

//Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get login page
router.get('/login', userCtrl.login);
// Get Log out
router.get('/logout', userCtrl.logout);
// Get strava auth
router.get('/strava-auth', userCtrl.stravaAuth);
// Redirect the user to Facebook for authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// Get 
router.get('/auth/facebook/callback', passport.authenticate('facebook'), userCtrl.facebookCallback);
// Get Homepage
router.get('/:id', userCtrl.home);

module.exports = router;