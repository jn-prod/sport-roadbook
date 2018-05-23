var express = require('express'),
    router = express.Router();

//Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', userCtrl.login);

module.exports = router;