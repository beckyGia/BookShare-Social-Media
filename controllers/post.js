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
 * Post /post/createPost
 */
exports.createPost = async (req, res) => {
  try {
    console.log(req.body);
    let newPost = {
      caption: req.body["post-textarea"],
      status: req.body["public-settings"],
      user: req.user.id,
    };

    if (req.file) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      newPost.mediaType = "image";
      newPost.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.postImageURL) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.postImageURL, {
        folder: "bookShareApp",
      });

      newPost.mediaType = "image";
      newPost.photo = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.postGIF) {
      // Upload image to cloudinary
      let result = await cloudinary.uploader.upload(req.body.postGIF, {
        folder: "bookShareApp",
      });

      newPost.mediaType = "gif";
      newPost.gif = {
        image: result.secure_url,
        cloudinary: result.public_id,
      };
    } else if (req.body.bookCoverPhoto) {
      newPost.mediaType = "book";
      newPost.book = {
        title: req.body.bookTitle,
        author: req.body.bookAuthor,
        bookCoverPhoto: req.body.bookCoverPhoto,
        synopsis: req.body.bookSynopsis,
      };

      // Check if genres are provided and add them if they exist
      if (req.body.bookGenres) {
        newPost.book.genres = req.body.bookGenres.split(",");
      }
    } else {
      newPost.mediaType = "none";
    }

    // Ensure the 'book' property is an empty object if not provided
    if (!newPost.mediaType == "book") {
      newPost.book = null;
    }

    await Post.create(newPost);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the post.");
  }
};

/**
 * Put /post/editPost/:postId
 */
exports.editPost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    let result;

    // Remove previous media based on mediaType
    if (post.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.photo.cloudinary);
    } else if (post.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.gif.cloudinary);
      post.gif.image = null;
      post.gif.cloudinary = null;
      post.gif = {};
    } else if (post.mediaType === "book") {
      post.book = {}; // Initialize as an empty object
    }

    console.log("req.body", req.body);
    console.log("req.file", req.file);

    // Replace information with new info
    post.caption = req.body["post-textarea"];
    post.status = req.body["public-settings"];

    if (req.file) {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      post.mediaType = "image";
      post.photo.image = result.secure_url;
      post.photo.cloudinary = result.public_id;
    } else if (req.body.editImageUrl) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.editImageUrl, {
        folder: "bookShareApp",
      });
      post.mediaType = "image";
      post.photo.image = result.secure_url;
      post.photo.cloudinary = result.public_id;
    } else if (req.body.editPostGIF) {
      // Upload image to cloudinary (ensure that the field name matches your form input)
      result = await cloudinary.uploader.upload(req.body.editPostGIF, {
        folder: "bookShareApp",
      });
      post.mediaType = "gif";
      post.gif.image = result.secure_url;
      post.gif.cloudinary = result.public_id;
    } else if (req.body.bookCoverPhoto) {
      post.mediaType = "book";
      post.book.bookCoverPhoto = req.body.bookCoverPhoto;
      post.book.title = req.body.bookTitle;
      post.book.author = req.body.bookAuthor;
      post.book.synopsis = req.body.bookSynopsis;
      post.book.genres = req.body.bookGenres.split(",");
    } else {
      post.mediaType = "none";
    }

    // Save the changes to the database
    await post.save();
    console.log(`Post ${post._id} has been updated successfully`);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while editing this post.");
  }
};

/**
 * Put /post/likePostProfile/:postId
 */
exports.likePostProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // User has already liked the post
      console.log("User has already liked this post.");
      return res.status(400).send("You have already liked this post.");
    }

    // If the user hasn't liked the post, create a new like
    const likeObj = {
      user: userId,
      post: postId,
    };

    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the post.");
  }
};

/**
 * Put /post/likePostUserProfile/:postId/:userId
 */
exports.likePostUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // User has already liked the post
      console.log("User has already liked this post.");
      return res.status(400).send("You have already liked this post.");
    }

    // If the user hasn't liked the post, create a new like
    const likeObj = {
      user: userId,
      post: postId,
    };

    await Like.create(likeObj);
    console.log("Likes +1");
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the post.");
  }
};

/**
 * Put /post/unlikePostProfile/:postId
 */
exports.unlikePostProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Find and delete the user's like for the post
    const result = await Like.deleteOne({ user: userId, post: postId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the post.");
  }
};

/**
 * Put /post/unlikePostUserProfile/:postId/:userId
 */
exports.unlikePostUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // Find and delete the user's like for the post
    const result = await Like.deleteOne({ user: userId, post: postId });

    if (result.deletedCount === 0) {
      // No like found to delete
      console.log("No like found to delete.");
      return res.status(400).send("No like found to delete.");
    }

    console.log("Likes -1");
    res.redirect("/profile/" + req.params.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the post.");
  }
};

/**
 * Delete /post/deletePost
 */
exports.deletePost = async (req, res) => {
  try {
    // Find post by id with related comments
    let post = await Post.findById({ _id: req.params.id })
      .populate("likes")
      .populate("comments");

    // Remove Media Based On MediaType
    if (post.mediaType === "image") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.photo.cloudinary);
    } else if (post.mediaType === "gif") {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.gif.cloudinary);
    }

    // Delete all comments:
    const commentIDs = [];
    const comments = post.comments;
    while (comments.length) {
      const comment = comments.pop();

      // Remove Media Based On MediaType
      if (comment.mediaType === "image") {
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(comment.photo.cloudinary);
      } else if (comment.mediaType === "gif") {
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(comment.gif.cloudinary);
      }

      comments.push(...comment.comments);
      commentIDs.push(comment.id);
    }

    await Comment.deleteMany({ _id: { $in: commentIDs } });
    // Delete the likes from the post
    await Like.deleteMany({ post: req.params.id });
    // Delete post from db
    await Post.deleteOne({ _id: req.params.id });
    console.log("Deleted Post");

    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the post.");
  }
};
