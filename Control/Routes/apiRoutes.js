const express = require('express');
const router = express.Router();
const apiController = require('../Controller/apiController');

router.get('/covers', apiController.getCovers);
router.get('/search', apiController.searchByTitle);
router.get('/search/genre', apiController.searchByGenre);   // GET /manga/search/genre?genres=Action,Romance&exclude=Harem
router.get('/search/status', apiController.searchByStatus);
router.get('/:id', apiController.getMangaById);

module.exports = router;