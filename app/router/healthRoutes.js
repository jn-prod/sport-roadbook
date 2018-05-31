// node_modules
var express = require('express'),
    router = express.Router();

//Controllers
var healthCtrl = require('../controllers/healthController')

// ---------------- INDEX ----------------
// get add activity form
router.get('/add', healthCtrl.getAddStatus);
// post add activity form
router.post('/add', healthCtrl.postAddStatus);

module.exports = router;