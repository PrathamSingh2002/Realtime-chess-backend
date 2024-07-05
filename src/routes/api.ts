const express = require('express');
const userController = require('../controllers/usercontroller')
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getallusers', userController.getAllUsers);
router.post('/getgamestats', userController.getGameStats);
router.post('/getuserdata', userController.getUserData);
// ... other routes for different controllers

module.exports = router;