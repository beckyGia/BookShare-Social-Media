const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const bookMarkController = require("../controllers/bookmark");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Create a new bookmark
router.post("/createBookMark/:postId", bookMarkController.createBookMark);
router.post(
  "/createBookMarkDashBoard/:postId",
  bookMarkController.createBookMarkDashBoard
);
router.post(
  "/createBookMarkProfile/:postId/:userId",
  bookMarkController.createBookMarkProfile
);
router.delete(
  "/removeBookMarkBookmarks/:bookmarkId",
  bookMarkController.removeBookMarkBookmarks
);
router.delete("/removeBookMark/:bookmarkId", bookMarkController.removeBookMark);
router.delete(
  "/removeBookMarkDashBoard/:bookmarkId",
  bookMarkController.removeBookMarkDashBoard
);
router.delete(
  "/removeBookMarkProfile/:bookmarkId/:userId",
  bookMarkController.removeBookMarkProfile
);

module.exports = router;
