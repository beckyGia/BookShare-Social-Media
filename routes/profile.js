const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, profileController.getUsersProfile);
router.get("/:id", profileController.getProfile);
router.patch(
  "/changeCoverImg",
  upload.single("file"),
  profileController.changeCoverPhoto
);
router.patch(
  "/changeProfileImg",
  upload.single("file"),
  profileController.changeProfilePhoto
);
router.patch("/editProfile", profileController.editProfile);
router.patch("/editProfileStatus", profileController.editProfileStatus);
router.delete("/deleteAccount", profileController.deleteAccount);

module.exports = router;
