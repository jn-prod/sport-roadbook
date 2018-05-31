// node_modules
var express = require('express'),
    router = express.Router();

//Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get login page
router.get('/login', userCtrl.login);
// Get Log out
router.get('/logout', userCtrl.logout);

// Redirect the user to strava for authentication
router.get('/auth/strava', userCtrl.stravaRequest );
// Get strava auth
router.get('/auth/strava/callback', userCtrl.stravaCallback);

// Get facebook user
router.get('/auth/facebook', userCtrl.facebookResponse);

// Get Homepage
router.get('/:id', userCtrl.home);

module.exports = router;