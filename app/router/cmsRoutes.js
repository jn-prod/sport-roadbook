var express = require('express'),
    router = express.Router();

//Controllers
var cmsCtrl = require('../controllers/cmsController')

// ---------------- INDEX ----------------
// Get Homepage
router.get('/', cmsCtrl.index);

module.exports = router;