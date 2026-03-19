const express = require("express");
const router = express.Router();
const pageController = require("../Controller/controller");
const { ensureAuthenticated } = require("../middleware/auth");

// router.get(URL,  Middleware(optional),   Handler)

router.get("/", ensureAuthenticated, pageController.getHomePage);
router.get("/login", pageController.getLoginPage);
router.get("/view", ensureAuthenticated, pageController.getViewPage);
router.get("/reader", ensureAuthenticated, pageController.getReaderPage);
router.get("/profile", ensureAuthenticated, pageController.getProfilePage);
router.get("/about", pageController.getAboutPage);

module.exports = router;
