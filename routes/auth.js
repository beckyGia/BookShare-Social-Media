const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/logout", authController.logout);
router.get("/details", ensureAuth, authController.getDetails);
router.post(
  "/details",
  ensureAuth,
  upload.fields([{ name: "file" }, { name: "coverFile" }]),
  authController.postDetails
);

module.exports = router;
