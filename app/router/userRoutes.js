// node_modules
var express = require('express')
var router = express.Router()

// Controllers
var userCtrl = require('../controllers/userController')
var authenticated = require('../../custom_modules/authenticate')

// ---------------- INDEX ----------------
// Get login page
router.get('/login', userCtrl.login)
// Get Log out
router.get('/logout', userCtrl.logout)

// Get Homepage
router.get('/:user', authenticated, userCtrl.home)

// Get profil
router.get('/:user/profil', authenticated, userCtrl.profil)

// get wait
router.get('/:user/wait', authenticated, userCtrl.wait)

// Get Delete Account
router.get('/:user/delete', authenticated, userCtrl.delete)

// Get edit Account
router.get('/:user/edit', authenticated, userCtrl.getEdit)

// POST edit Account
router.post('/:user/edit', authenticated, userCtrl.postEdit)

module.exports = router
