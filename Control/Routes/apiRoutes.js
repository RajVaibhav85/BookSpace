const express = require('express');
const router = express.Router();
const apiController = require('../Controller/apiController');

router.get("/covers",apiController.getCovers);

module.exports = router;