/**
 * User Controllers and Routes
 * @param  {Function} userControllers routes here
 */
const express = require('express');
const { userLogin, userRegister } = require('../controllers/userControllers');
const router = express.Router()
router.post('/login',userLogin)
router.post('/registration',userRegister)
module.exports = router;