// router/authRoutes.js
const express = require('express');
const { signup, login , getMe, protect, checkDeviceLock} = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login',  login);
router.get('/getme',  protect ,checkDeviceLock  , getMe);

module.exports = router;
