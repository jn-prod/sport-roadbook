// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var userCtrl = require('../controllers/userController')

// ---------------- INDEX ----------------
// Get login page
router.get('/login', userCtrl.login)
// Get Log out
router.get('/logout', userCtrl.logout)

// Get Homepage
router.get('/:user', userCtrl.home)

// Get profil
router.get('/:user/profil', userCtrl.profil)

// get wait
router.get('/:user/wait', userCtrl.wait)

// Get Delete Account
router.get('/delete/:id', userCtrl.delete)

module.exports = router
