const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const followController = require("../controllers/follow");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Create a new follow
router.put("/followUser/:followingUserId", followController.createFollow);
router.put(
  "/followUserFriends/:followingUserId",
  followController.createFollowFriends
);
router.put("/unfollowUser/:followingUserId", followController.removeFollow);
router.put(
  "/unfollowUserFriends/:followingUserId",
  followController.removeFollowFriends
);

module.exports = router;
