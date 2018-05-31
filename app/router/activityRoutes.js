// node_modules
var express = require('express'),
    router = express.Router();

//Controllers
var activityCtrl = require('../controllers/activityController')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', activityCtrl.getAddActivity);
// post add activity form
router.post('/add', activityCtrl.postAddActivity);

module.exports = router;