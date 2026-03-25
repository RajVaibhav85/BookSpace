const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/register',                                    userController.registerUser);
router.post('/login',                                       userController.loginUser);
router.get('/logout',               ensureAuthenticated,    userController.logout);

router.get('/getHistoryByUser',     ensureAuthenticated,    userController.getHistoryByUser);
router.get('/getUserDetails',       ensureAuthenticated,    userController.getUserDetails);
router.get('/getLibraryByUser',     ensureAuthenticated,    userController.getLibraryByUser);

router.post('/addToHistory',                                userController.addToHistory);
router.post('/addToLibrary',        ensureAuthenticated,    userController.addToLibrary);
router.post('/removeFromLibrary',   ensureAuthenticated,    userController.removeFromLibrary)
router.post('/updateUserDetails',   ensureAuthenticated,    userController.updateUserDetails);
router.post('/updatePassword',      ensureAuthenticated,    userController.updatePassword);
router.post('/deleteAccount',       ensureAuthenticated,    userController.deleteAccount);

module.exports = router;