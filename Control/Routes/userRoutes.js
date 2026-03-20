const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

router.get('/logout',           userController.logout);

router.post('/register',        userController.registerUser);
router.post('/login',           userController.loginUser);
router.post('/addToLibrary',    userController.addToLibrary);
router.get('/getHistoryByUser', userController.getHistoryByUser);
router.post('/addToHistory',    userController.addToHistory);
router.get('/getUserDetails',   userController.getUserDetails);
router.get('/getLibraryByUser', userController.getLibraryByUser);
router.post('/removeFromLibrary', userController.removeFromLibrary)
router.post('/updateUserDetails', userController.updateUserDetails);
router.post('/updatePassword',  userController.updatePassword);
router.post('/deleteAccount',   userController.deleteAccount);

module.exports = router;