const express = require('express');
const router = express.Router();
const userController = require('../Controller/bookController');

router.get('/getFeedbackByBook/:bookid', userController.getFeedbackByBook);
router.post('/addFeedback', userController.addFeedback);

module.exports = router;