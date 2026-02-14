const express = require("express");
const router = express.Router();
const pageController = require("../Controller/controller");

router.get("/", pageController.getHomePage);
router.get("/login", pageController.getLoginPage);
router.get("/manga", pageController.getMangaPage);
router.get("/manhwa", pageController.getManhwaPage);
router.get("/lightnovels", pageController.getLightNovelsPage);
router.get("/comics", pageController.getComicsPage);


module.exports = router;
