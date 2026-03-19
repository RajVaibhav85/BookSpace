const express = require('express');
const router = express.Router();
const userController = require('../Controller/bookController');

router.get('/getFeedbackByBook/:bookId', userController.getFeedbackByBook);

module.exports = router;