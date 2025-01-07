const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const commentController = require("../controllers/comment");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post(
  "/createComment/:postId/:commentId?",
  upload.single("file"),
  commentController.createComment
);
router.post(
  "/createCommentDashboard/:postId/:commentId?",
  upload.single("file"),
  commentController.createCommentDashboard
);
router.post(
  "/createCommentBookmark/:postId/:commentId?",
  upload.single("file"),
  commentController.createCommentBookmark
);
router.post(
  "/createUserComment/:postId/:commentId?/:user",
  upload.single("file"),
  commentController.createUserComment
);
router.put(
  "/editComment/:postId/:commentId",
  upload.single("file"),
  commentController.editComment
);
router.put(
  "/editCommentDashboard/:postId/:commentId",
  upload.single("file"),
  commentController.editCommentDashboard
);
router.put(
  "/editCommentBookmark/:postId/:commentId",
  upload.single("file"),
  commentController.editCommentBookmark
);
router.put(
  "/editUserComment/:postId/:commentId/:user",
  upload.single("file"),
  commentController.editUserComment
);
router.put("/likeCommentProfile/:id", commentController.likeCommentProfile);
router.put("/likeCommentDashboard/:id", commentController.likeCommentDashboard);
router.put("/likeCommentBookmark/:id", commentController.likeCommentBookmark);
router.put(
  "/likeUserCommentProfile/:commentId/:user",
  commentController.likeUserCommentProfile
);
router.put("/unlikeCommentProfile/:id", commentController.unlikeCommentProfile);
router.put(
  "/unlikeCommentDashboard/:id",
  commentController.unlikeCommentDashboard
);
router.put(
  "/unlikeCommentBookmark/:id",
  commentController.unlikeCommentBookmark
);
router.put(
  "/unlikeUserCommentProfile/:commentId/:user",
  commentController.unlikeUserCommentProfile
);
router.delete(
  "/deleteComment/:postId/:commentId",
  commentController.deleteComment
);
router.delete(
  "/deleteCommentDashboard/:postId/:commentId",
  commentController.deleteCommentDashboard
);
router.delete(
  "/deleteCommentBookmark/:postId/:commentId",
  commentController.deleteCommentBookmark
);
router.delete(
  "/deleteUserComment/:postId/:commentId/:user",
  commentController.deleteUserComment
);

module.exports = router;
