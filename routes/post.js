const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postController = require("../controllers/post");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/createPost", upload.single("file"), postController.createPost);
router.put("/editPost/:id", upload.single("file"), postController.editPost);
router.put("/likePostProfile/:id", postController.likePostProfile);
router.put(
  "/likePostUserProfile/:id/:user",
  postController.likePostUserProfile
);
router.put("/unlikePostProfile/:id", postController.unlikePostProfile);
router.put(
  "/unlikePostUserProfile/:id/:user",
  postController.unlikePostUserProfile
);
router.delete("/deletePost/:id", postController.deletePost);

module.exports = router;
