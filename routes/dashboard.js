const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const dashboardController = require("../controllers/dashboard");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, dashboardController.getDashboard);
router.put(
  "/editPostDashboard/:id",
  upload.single("file"),
  dashboardController.editPostDashboard
);
router.put("/likePostDashboard/:id", dashboardController.likePostDashboard);
router.put("/likePostBookmarks/:id", dashboardController.likePostBookmarks);
router.put("/unlikePostDashboard/:id", dashboardController.unlikePostDashboard);
router.put("/unlikePostBookmarks/:id", dashboardController.unlikePostBookmarks);
router.delete(
  "/deletePostDashboard/:id",
  dashboardController.deletePostDashboard
);
router.get("/bookList", dashboardController.getBookList);
router.get("/readingList", dashboardController.getReadingList);
router.get("/favorites", dashboardController.getFavorites);
router.get("/groups", dashboardController.getGroups);
router.get("/bookmarks", dashboardController.getBookmarks);
router.get("/friends", dashboardController.getFriends);

module.exports = router;
