const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const groupController = require("../controllers/group");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/createGroup", upload.single("file"), groupController.createGroup);
router.put("/joinGroup/:groupId", groupController.joinGroup);
router.put("/joinGroupDashboard/:groupId", groupController.joinGroupDashboard);
router.put("/removeGroup/:groupId", groupController.removeGroup);
router.put(
  "/removeGroupDashboard/:groupId",
  groupController.removeGroupDashboard
);
router.put(
  "/editGroup/:groupId",
  upload.single("file"),
  groupController.editGroup
);
router.delete("/deleteGroup/:groupId", groupController.deleteGroup);

module.exports = router;
