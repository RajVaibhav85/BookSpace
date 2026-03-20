const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

router.get('/logout',           userController.logout);

router.post('/register',        userController.registerUser);
router.post('/login',           userController.loginUser);
router.post('/addToLibrary',    userController.addToLibrary);
router.post('/addToHistory',    userController.addToHistory);
router.get('/getUserDetails',   userController.getUserDetails);
router.post('/updateUserDetails', userController.updateUserDetails);
router.post('/updatePassword',  userController.updatePassword);

module.exports = router;