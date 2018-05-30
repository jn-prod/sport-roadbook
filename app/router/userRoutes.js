var express = require('express'),
    router = express.Router();

//Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get login page
router.get('/login', userCtrl.login);
// Get Log out
router.get('/logout', userCtrl.logout);
// Get strava auth
router.get('/strava-auth', userCtrl.stravaAuth);
// Get facebook auth
router.get('/facebook-auth', userCtrl.facebookAuth);
// Get Homepage
router.get('/:id', userCtrl.home);

module.exports = router;