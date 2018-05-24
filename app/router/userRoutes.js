var express = require('express'),
    router = express.Router();

//Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', userCtrl.home);

module.exports = router;