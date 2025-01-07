const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Bookmark = require("../models/Bookmark");

/**
 * Post /bookmark/createBookMark/:postId
 */
exports.createBookMark = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const bookmark = new Bookmark({
      user: userId,
      post: postId,
    });

    await bookmark.save();
    console.log("Bookmark Created!");
    res.redirect("/profile");
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Post /bookmark/createBookMarkDashBoard/:postId
 */
exports.createBookMarkDashBoard = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const bookmark = new Bookmark({
      user: userId,
      post: postId,
    });

    await bookmark.save();
    console.log("Bookmark Created!");
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Post /bookmark/createBookMarkProfile/:postId/:userId
 */
exports.createBookMarkProfile = async (req, res) => {
  const postId = req.params.postId;
  const currentUserId = req.user.id; // Assuming user is authenticated

  try {
    const bookmark = new Bookmark({
      user: currentUserId,
      post: postId,
    });

    await bookmark.save();
    console.log("Bookmark Created!");
    res.redirect("/profile/" + req.params.userId);
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Delete /bookmark/removeBookMarkBookmarks/:bookmarkId
 */
exports.removeBookMarkBookmarks = async (req, res) => {
  const bookmarkId = req.params.bookmarkId;

  try {
    await Bookmark.findByIdAndDelete(bookmarkId);
    console.log("Bookmark Deleted!");
    res.redirect("/dashboard/bookmarks");
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Delete /bookmark/removeBookMark/:postId
 */
exports.removeBookMark = async (req, res) => {
  const bookmarkId = req.params.bookmarkId;

  try {
    await Bookmark.findByIdAndDelete(bookmarkId);
    console.log("Bookmark Deleted!");
    res.redirect("/profile");
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Delete /bookmark/removeBookMarkDashBoard/:postId
 */
exports.removeBookMarkDashBoard = async (req, res) => {
  const bookmarkId = req.params.bookmarkId;

  try {
    await Bookmark.findByIdAndDelete(bookmarkId);
    console.log("Bookmark Deleted!");
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

/**
 * Delete /bookmark/removeBookMarkProfile/:postId/:userId
 */
exports.removeBookMarkProfile = async (req, res) => {
  const bookmarkId = req.params.bookmarkId;

  try {
    await Bookmark.findByIdAndDelete(bookmarkId);
    console.log("Bookmark Deleted!");
    res.redirect("/profile/" + req.params.userId);
  } catch (error) {
    res.status(500).send({ error: "Unable to create bookmark" });
  }
};

// // Route to remove a bookmark
// app.delete("/removeBookmark/:id", async (req, res) => {
//   const bookmarkId = req.params.id;

//   try {
//     await Bookmark.findByIdAndDelete(bookmarkId);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Unable to remove bookmark" });
//   }
// });
