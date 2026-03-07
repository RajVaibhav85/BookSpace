const express = require("express");
const router = express.Router();
const pageController = require("../Controller/controller");
const { ensureAuthenticated } = require("../middleware/auth");

// router.get(URL,  Middleware(optional),   Handler)

router.get("/", ensureAuthenticated, pageController.getHomePage);
router.get("/login", pageController.getLoginPage);
router.get("/view", pageController.getViewPage);
router.get("/reader", pageController.getReaderPage);


// router.get("/manga", pageController.getMangaPage);
// router.get("/manhwa", pageController.getManhwaPage);
// router.get("/lightnovels", pageController.getLightNovelsPage);
// router.get("/comics", pageController.getComicsPage);


module.exports = router;
