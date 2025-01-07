const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const booksController = require("../controllers/books");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post(
  "/addCompleted",
  upload.single("file"),
  booksController.addCompleted
);
router.post("/addReading", upload.single("file"), booksController.addReading);
router.post(
  "/addReadingProfile",
  upload.single("file"),
  booksController.addReadingProfile
);
router.post(
  "/addReadingPost",
  upload.single("file"),
  booksController.addReadingPost
);
router.post(
  "/addReadingPostDashboard",
  upload.single("file"),
  booksController.addReadingPostDashboard
);
router.post(
  "/addReadingPostBookmark",
  upload.single("file"),
  booksController.addReadingPostBookmark
);
router.put("/editBook/:id", upload.single("file"), booksController.editBook);
router.patch("/addEditRating/:id", booksController.addEditRating);
router.patch(
  "/addEditFavoriteRating/:id",
  booksController.addEditFavoriteRating
);
router.patch("/markFavorite/:id", booksController.markFavorite);
router.patch("/unFavorite/:id", booksController.unFavorite);
router.patch(
  "/unFavoriteFromFavorites/:id",
  booksController.unFavoriteFromFavorites
);
router.patch("/markComplete/:id", booksController.markComplete);
router.delete("/deleteBook/:id", booksController.deleteBook);
router.delete(
  "/deleteFromReadingList/:id",
  booksController.deleteFromReadingList
);

module.exports = router;
