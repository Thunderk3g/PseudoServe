const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

// Define user-related routes
router.post('/register', userController.register);
router.post('/login', userController.login);
// ... and other user routes

module.exports = router;
