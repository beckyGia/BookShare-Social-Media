const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Book = require("../models/Book");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const cloudinary = require("../middleware/cloudinary");

/**
 * Post /post/createComment/:postId/:commentId?
 */
exports.createComment = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    let newComment = {
      caption: req.body["comment-textarea"],
      user: req.user.id,
      post: req.params.commentId ? undefined : req.params.postId, //get this from the comment/createComment/:id - id portion of this path which is the postsID
      // This ternary operator is saying that if there is a commentID, the post id is undefined else post id is req.params.postId
      comment: req.params.commentId,
    };

    if (req.file) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "image";
      newComment.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "gif";
      newComment.gif = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else {
      newComment.mediaType = "none";
    }

    await Comment.create(newComment);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Post /post/createCommentDashboard/:postId/:commentId?
 */
exports.createCommentDashboard = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    let newComment = {
      caption: req.body["comment-textarea"],
      user: req.user.id,
      post: req.params.commentId ? undefined : req.params.postId, //get this from the comment/createComment/:id - id portion of this path which is the postsID
      // This ternary operator is saying that if there is a commentID, the post id is undefined else post id is req.params.postId
      comment: req.params.commentId,
    };

    if (req.file) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "image";
      newComment.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "gif";
      newComment.gif = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else {
      newComment.mediaType = "none";
    }

    await Comment.create(newComment);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Post /post/createCommentBookmark/:postId/:commentId?
 */
exports.createCommentBookmark = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    let newComment = {
      caption: req.body["comment-textarea"],
      user: req.user.id,
      post: req.params.commentId ? undefined : req.params.postId, //get this from the comment/createComment/:id - id portion of this path which is the postsID
      // This ternary operator is saying that if there is a commentID, the post id is undefined else post id is req.params.postId
      comment: req.params.commentId,
    };

    if (req.file) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "image";
      newComment.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "gif";
      newComment.gif = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else {
      newComment.mediaType = "none";
    }

    await Comment.create(newComment);
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Post /post/createUserComment/:postId/:commentId?/:user
 */
exports.createUserComment = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    let newComment = {
      caption: req.body["comment-textarea"],
      user: req.user.id,
      post: req.params.commentId ? undefined : req.params.postId, //get this from the comment/createComment/:id - id portion of this path which is the postsID
      // This ternary operator is saying that if there is a commentID, the post id is undefined else post id is req.params.postId
      comment: req.params.commentId,
    };

    if (req.file) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "image";
      newComment.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });

      newComment.mediaType = "gif";
      newComment.gif = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else {
      newComment.mediaType = "none";
    }

    await Comment.create(newComment);
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Put /comment/editComment/:postId/:commentId
 */
exports.editComment = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.commentId);
    let comment = await Comment.findById(req.params.commentId);
    let result;

    // Remove previous media based on mediaType
    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = null;
      comment.photo.cloudinary = null;
      comment.photo = {};
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = null;
      comment.gif.cloudinary = null;
      comment.gif = {};
    }

    // Replace information with new info
    comment.caption = req.body["comment-textarea"];

    if (req.file) {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentPhoto) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentPhoto, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });
      comment.mediaType = "gif";
      comment.gif.image = result.secure_url;
      comment.gif.cloudinary = result.public_id;
    } else {
      comment.mediaType = "none";
    }
    comment.edited = true;

    // Save the changes to the database
    await comment.save();
    console.log(`Comment ${comment._id} has been updated successfully`);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Put /comment/editCommentDashboard/:postId/:commentId
 */
exports.editCommentDashboard = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.commentId);
    let comment = await Comment.findById(req.params.commentId);
    let result;

    // Remove previous media based on mediaType
    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = null;
      comment.photo.cloudinary = null;
      comment.photo = {};
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = null;
      comment.gif.cloudinary = null;
      comment.gif = {};
    }

    // Replace information with new info
    comment.caption = req.body["comment-textarea"];

    if (req.file) {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentPhoto) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentPhoto, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });
      comment.mediaType = "gif";
      comment.gif.image = result.secure_url;
      comment.gif.cloudinary = result.public_id;
    } else {
      comment.mediaType = "none";
    }
    comment.edited = true;

    // Save the changes to the database
    await comment.save();
    console.log(`Comment ${comment._id} has been updated successfully`);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Put /comment/editCommentBookmark/:postId/:commentId
 */
exports.editCommentBookmark = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.commentId);
    let comment = await Comment.findById(req.params.commentId);
    let result;

    // Remove previous media based on mediaType
    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = null;
      comment.photo.cloudinary = null;
      comment.photo = {};
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = null;
      comment.gif.cloudinary = null;
      comment.gif = {};
    }

    // Replace information with new info
    comment.caption = req.body["comment-textarea"];

    if (req.file) {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentPhoto) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentPhoto, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });
      comment.mediaType = "gif";
      comment.gif.image = result.secure_url;
      comment.gif.cloudinary = result.public_id;
    } else {
      comment.mediaType = "none";
    }
    comment.edited = true;

    // Save the changes to the database
    await comment.save();
    console.log(`Comment ${comment._id} has been updated successfully`);
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Put /comment/editUserComment/:postId/:commentId/:user
 */
exports.editUserComment = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.commentId);
    let comment = await Comment.findById(req.params.commentId);
    let result;

    // Remove previous media based on mediaType
    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = null;
      comment.photo.cloudinary = null;
      comment.photo = {};
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = null;
      comment.gif.cloudinary = null;
      comment.gif = {};
    }

    // Replace information with new info
    comment.caption = req.body["comment-textarea"];

    if (req.file) {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentPhoto) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentPhoto, {
        folder: "bookShareApp",
      });
      comment.mediaType = "image";
      comment.photo.image = result.secure_url;
      comment.photo.cloudinary = result.public_id;
    } else if (req.body.commentGIF) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.commentGIF, {
        folder: "bookShareApp",
      });
      comment.mediaType = "gif";
      comment.gif.image = result.secure_url;
      comment.gif.cloudinary = result.public_id;
    } else {
      comment.mediaType = "none";
    }
    comment.edited = true;

    // Save the changes to the database
    await comment.save();
    console.log(`Comment ${comment._id} has been updated successfully`);
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the comment.");
  }
};

/**
 * Put /comment/likeCommentProfile/:commentId
 */
exports.likeCommentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      // User has already liked the comment
      console.log("User has already liked this comment.");
      return res.status(400).send("You have already liked this comment.");
    }

    // If the user hasn't liked the comment, create a new like
    const likeObj = {
      user: userId,
      comment: commentId,
    };

    console.log(likeObj);

    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the comment.");
  }
};

/**
 * Put /comment/likeCommentDashboard/:commentId
 */
exports.likeCommentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      // User has already liked the comment
      console.log("User has already liked this comment.");
      return res.status(400).send("You have already liked this comment.");
    }

    // If the user hasn't liked the comment, create a new like
    const likeObj = {
      user: userId,
      comment: commentId,
    };

    console.log(likeObj);

    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the comment.");
  }
};

/**
 * Put /comment/likeCommentBookmark/:commentId
 */
exports.likeCommentBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      // User has already liked the comment
      console.log("User has already liked this comment.");
      return res.status(400).send("You have already liked this comment.");
    }

    // If the user hasn't liked the comment, create a new like
    const likeObj = {
      user: userId,
      comment: commentId,
    };

    console.log(likeObj);

    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the comment.");
  }
};

/**
 * Put /comment/likeUserCommentProfile/:commentId/:user
 */
exports.likeUserCommentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });
    if (existingLike) {
      // User has already liked the comment
      console.log("User has already liked this comment.");
      return res.status(400).send("You have already liked this comment.");
    }
    // If the user hasn't liked the comment, create a new like
    const likeObj = {
      user: userId,
      comment: commentId,
    };
    console.log(likeObj);
    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the comment.");
  }
};

/**
 * Put /comment/unlikeCommentProfile/:commentId
 */
exports.unlikeCommentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Find and delete the user's like for the comment
    const result = await Like.deleteOne({ user: userId, comment: commentId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Put /comment/unlikeCommentDashboard/:commentId
 */
exports.unlikeCommentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Find and delete the user's like for the comment
    const result = await Like.deleteOne({ user: userId, comment: commentId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Put /comment/unlikeCommentBookmark/:commentId
 */
exports.unlikeCommentBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // Find and delete the user's like for the comment
    const result = await Like.deleteOne({ user: userId, comment: commentId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Put /comment/unlikeUserCommentProfile/:commentId/:user
 */
exports.unlikeUserCommentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    // Find and delete the user's like for the comment
    const result = await Like.deleteOne({ user: userId, comment: commentId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Delete /comment/deleteComment/:postId/:commentId
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "comments"
    );

    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = "";
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = "";
    }

    // Delete the likes from the comment
    await Like.deleteMany({ comment: req.params.commentId });

    if (!comment.comments.length) {
      // If it doesn't have additional comments
      await Comment.findByIdAndRemove(req.params.commentId); // Delete the comment explicitly
      console.log("Comment has been deleted!");
      return res.redirect("/profile");
    }

    comment.caption = "Comment Has Been Deleted"; // Do this to keep the structure
    comment.mediaType = "none";
    comment.deleted = true;
    await comment.save();

    console.log("Comment has been cleared!");
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Delete /comment/deleteCommentDashboard/:postId/:commentId
 */
exports.deleteCommentDashboard = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "comments"
    );

    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = "";
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = "";
    }

    // Delete the likes from the comment
    await Like.deleteMany({ comment: req.params.commentId });

    if (!comment.comments.length) {
      // If it doesn't have additional comments
      await Comment.findByIdAndRemove(req.params.commentId); // Delete the comment explicitly
      console.log("Comment has been deleted!");
      return res.redirect("/dashboard");
    }

    comment.caption = "Comment Has Been Deleted"; // Do this to keep the structure
    comment.mediaType = "none";
    comment.deleted = true;
    await comment.save();

    console.log("Comment has been cleared!");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Delete /comment/deleteCommentBookmark/:postId/:commentId
 */
exports.deleteCommentBookmark = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "comments"
    );

    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = "";
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = "";
    }

    // Delete the likes from the comment
    await Like.deleteMany({ comment: req.params.commentId });

    if (!comment.comments.length) {
      // If it doesn't have additional comments
      await Comment.findByIdAndRemove(req.params.commentId); // Delete the comment explicitly
      console.log("Comment has been deleted!");
      return res.redirect("/dashboard/bookmarks");
    }

    comment.caption = "Comment Has Been Deleted"; // Do this to keep the structure
    comment.mediaType = "none";
    comment.deleted = true;
    await comment.save();

    console.log("Comment has been cleared!");
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};

/**
 * Delete /comment/deleteUserComment/:postId/:commentId/:user
 */
exports.deleteUserComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "comments"
    );
    if (comment.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
      comment.photo.image = "";
    } else if (comment.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
      comment.gif.image = "";
    }
    // Delete the likes from the comment
    await Like.deleteMany({ comment: req.params.commentId });
    if (!comment.comments.length) {
      // If it doesn't have additional comments
      await Comment.findByIdAndRemove(req.params.commentId); // Delete the comment explicitly
      console.log("Comment has been deleted!");
      return res.redirect("/profile/" + req.params.user);
    }
    comment.caption = "Comment Has Been Deleted"; // Do this to keep the structure
    comment.mediaType = "none";
    comment.deleted = true;
    await comment.save();
    console.log("Comment has been cleared!");
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the comment.");
  }
};
