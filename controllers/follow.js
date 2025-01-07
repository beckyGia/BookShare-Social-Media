const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Book = require("../models/Book");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const cloudinary = require("../middleware/cloudinary");

/**
 * Put /follow/followUser/:id
 */
exports.createFollow = async (req, res) => {
  try {
    const followingUserId = req.params.followingUserId;
    const userId = req.user._id; // Assuming you have user information in req.user

    if (userId === followingUserId) {
      // You can't follow yourself
      console.log("You can't follow yourself");
      return res.status(400).send("You can't follow yourself.");
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: followingUserId,
    });
    if (existingFollow) {
      console.log("User has already followed this user");
      return res.status(400).send("You are already following this user.");
    }
    const newFollow = new Follow({
      follower: userId,
      following: followingUserId,
    });
    await newFollow.save();
    console.log("You are now following this user!");
    res.redirect("/profile/" + followingUserId);
  } catch (err) {
    console.error("Error creating follow:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Put /follow/followUserFriends/:id
 */
exports.createFollowFriends = async (req, res) => {
  try {
    const followingUserId = req.params.followingUserId;
    const userId = req.user._id; // Assuming you have user information in req.user

    if (userId === followingUserId) {
      // You can't follow yourself
      console.log("You can't follow yourself");
      return res.status(400).send("You can't follow yourself.");
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: followingUserId,
    });
    if (existingFollow) {
      console.log("User has already followed this user");
      return res.status(400).send("You are already following this user.");
    }
    const newFollow = new Follow({
      follower: userId,
      following: followingUserId,
    });
    await newFollow.save();
    console.log("You are now following this user!");
    res.redirect("/dashboard/friends");
  } catch (err) {
    console.error("Error creating follow:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Put /follow/unfollowUser/:id
 */
exports.removeFollow = async (req, res) => {
  try {
    const followingUserId = req.params.followingUserId;
    const userId = req.user._id; // Assuming you have user information in req.user

    // Check if the user has already liked the post
    const existingFollow = await Follow.deleteOne({
      follower: userId,
      following: followingUserId,
    });

    console.log("You are no longer following this user!");
    res.redirect("/profile/" + followingUserId);
  } catch (err) {
    console.error("Error creating follow:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Put /follow/unfollowUserFriends/:id
 */
exports.removeFollowFriends = async (req, res) => {
  try {
    const followingUserId = req.params.followingUserId;
    const userId = req.user._id; // Assuming you have user information in req.user

    // Check if the user has already liked the post
    const existingFollow = await Follow.deleteOne({
      follower: userId,
      following: followingUserId,
    });

    console.log("You are no longer following this user!");
    res.redirect("/dashboard/friends");
  } catch (err) {
    console.error("Error creating follow:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
