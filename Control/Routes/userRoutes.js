const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get('/logout', userController.logout);
module.exports = router;