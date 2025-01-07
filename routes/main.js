const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", homeController.getIndex);
// router.get("/dashboard", ensureAuth, homeController.getDashboard);
// router.get("/profile", homeController.getProfile);
router.get("/otherProfile", homeController.getOtherProfile);
// router.get("/bookList", homeController.getBookList);
// router.get("/readingList", homeController.getReadingList);
router.get("/favorites", homeController.getFavorites);
router.get("/groups", homeController.getGroups);
router.get("/friends", homeController.getFriends);
router.get("/discussion", homeController.getDiscussion);

module.exports = router;
