const express = require('express');
const router = express.Router();
const userController = require('../Controller/bookController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/getFeedbackByBook/:bookid',                            userController.getFeedbackByBook);
router.post('/addFeedback',                 ensureAuthenticated,    userController.addFeedback);

module.exports = router;