const passport = require("passport");
const validator = require("validator");
const mongoose = require("mongoose");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Follow = require("../models/Follow");
const Bookmark = require("../models/Bookmark");
const Book = require("../models/Book");
const Like = require("../models/Like");
const { Group } = require("../models/Group");
const cloudinary = require("../middleware/cloudinary");
const { DateTime } = require("luxon");

/**
 * Get /profile
 */
exports.getUsersProfile = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Profile",
    };
    const message = req.flash();

    // console.log(req.user);

    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "userName"
    );

    const bookmarks = await Bookmark.find({ user: req.user.id });

    const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "likes",
        populate: {
          path: "userInfo", // Populate the userInfo virtual
        },
      })
      .populate({
        path: "comments", // Populate comments
        populate: {
          path: "likes", // Populate likes for comments
          populate: {
            path: "userInfo", // Populate the userInfo virtual for comment likes
          },
        },
      });

    // Rename the function for clarity
    const populateCommentsRecursively = async (comments) => {
      if (!comments || comments.length === 0) {
        return [];
      }

      const populatedComments = await Comment.populate(comments, [
        { path: "user" },
        { path: "likes" },
      ]);

      for (const comment of populatedComments) {
        comment.comments = await populateCommentsRecursively(comment.comments);
      }

      return populatedComments;
    };

    // Find all the people you are following
    const followingList = await Follow.find({ follower: req.user.id })
      .populate("followingProfile")
      .populate("followingUserName");

    // Populate comments recursively for each post
    for (const post of posts) {
      post.comments = await populateCommentsRecursively(post.comments);
    }

    // The `.sort({ createdAt: -1 })` sorts posts by the `createdAt` field in descending order (most recent first).

    // Count the number of posts created before the post to be displayed
    const postNumberPromises = posts.map(async (post) => {
      const postNumber = await Post.countDocuments({
        user: req.user.id,
        createdAt: { $lt: post.createdAt },
      });
      return postNumber;
    });

    const postNumbers = await Promise.all(postNumberPromises);

    const findMutualFriends = async (loggedInUserId, targetUserId) => {
      const loggedInUserFollowingList = (
        await Follow.find({ follower: loggedInUserId }).distinct("following")
      ).map(String);

      const targetUserFollowingList = (
        await Follow.find({ follower: targetUserId }).distinct("following")
      ).map(String);

      const mutualFriends = loggedInUserFollowingList.filter((userId) =>
        targetUserFollowingList.includes(userId.toString())
      );

      return {
        mutual: mutualFriends.map((userId) => ({ _id: userId })),
        count: mutualFriends.length,
      };
    };

    // Iterate through each user in the followingList array
    for (const user of followingList) {
      const result = await findMutualFriends(req.user.id, user.following);
      user.mutualFriends = result.mutual;
      user.mutualFriendsCount = result.count;

      // Fetch profiles for each mutual friend
      const mutualFriendsProfiles = await Profile.find({
        user: { $in: result.mutual.map((friend) => friend._id) },
      }).populate("userName"); // Populate the userName field

      // Attach the profiles to the user object
      user.mutualFriendsProfiles = mutualFriendsProfiles;
    }

    const allBooks = await Book.find({ user: req.user.id });
    const books = await Book.find({
      user: req.user.id,
      "completed.type": true,
    });
    const readingBooks = await Book.find({
      user: req.user.id,
      "completed.type": false,
    });
    const favoriteBooks = await Book.find({
      user: req.user.id,
      favorite: true,
    });

    // Convert createdDate for each book to a formatted date string
    const createdCompletedDates = books.map((book) =>
      book.createdAt.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert createdDate for each book to a formatted date string
    const createdReadingDates = readingBooks.map((book) =>
      book.createdAt.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert completed.date for each book to a formatted date string
    const completedDates = books.map((book) =>
      book.completed.date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert birthDate to a formatted date string
    const birthDate = DateTime.fromJSDate(profile.birthDate).toLocaleString({
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC", // Set to 'UTC' to match MongoDB's time zone
    });

    res.render("profile.ejs", {
      locals,
      layout: "../views/layouts/profile.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      profile: profile,
      user: req.user,
      birthDate: birthDate,
      allBooks: allBooks,
      books: books,
      posts: posts,
      postNumbers: postNumbers,
      readingBooks: readingBooks,
      favoriteBooks: favoriteBooks,
      followingList: followingList,
      bookmarks: bookmarks,
      createdCompletedDates: createdCompletedDates,
      createdReadingDates: createdReadingDates,
      completedDates: completedDates,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get /profile/:id
 */
exports.getProfile = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Others Profile",
    };
    const message = req.flash();

    // console.log(req.user);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "userName"
    );

    const usersProfile = await Profile.findOne({
      user: req.params.id,
    }).populate("userName");

    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "likes",
        populate: {
          path: "userInfo", // Populate the userInfo virtual
        },
      })
      .populate({
        path: "comments", // Populate comments
        populate: {
          path: "likes", // Populate likes for comments
          populate: {
            path: "userInfo", // Populate the userInfo virtual for comment likes
          },
        },
      });

    // Check if the user is following the user whose profile is being viewed
    const isFollowing = await Follow.findOne({
      follower: req.user.id,
      following: req.params.id,
    });

    //check if the user is being followed by the user whose profile is being viewed
    const isFollowed = await Follow.findOne({
      follower: req.params.id,
      following: req.user.id,
    });

    const bookmarks = await Bookmark.find({ user: req.user.id });

    // Find all the people the person profile you are at is following
    const followingList = await Follow.find({ follower: req.params.id })
      .populate("followingProfile")
      .populate("followingUserName");

    const findMutualFriends = async (loggedInUserId, targetUserId) => {
      const loggedInUserFollowingList = (
        await Follow.find({ follower: loggedInUserId }).distinct("following")
      ).map(String);

      const targetUserFollowingList = (
        await Follow.find({ follower: targetUserId }).distinct("following")
      ).map(String);

      const mutualFriends = loggedInUserFollowingList.filter((userId) =>
        targetUserFollowingList.includes(userId.toString())
      );

      return {
        mutual: mutualFriends.map((userId) => ({ _id: userId })),
        count: mutualFriends.length,
      };
    };

    // Iterate through each user in the followingList array
    for (const user of followingList) {
      const result = await findMutualFriends(req.user.id, user.following);
      user.mutualFriends = result.mutual;
      user.mutualFriendsCount = result.count;

      // Fetch profiles for each mutual friend
      const mutualFriendsProfiles = await Profile.find({
        user: { $in: result.mutual.map((friend) => friend._id) },
      }).populate("userName"); // Populate the userName field

      // Attach the profiles to the user object
      user.mutualFriendsProfiles = mutualFriendsProfiles;
    }

    // Rename the function for clarity
    const populateCommentsRecursively = async (comments) => {
      if (!comments || comments.length === 0) {
        return [];
      }

      const populatedComments = await Comment.populate(comments, [
        { path: "user" },
        { path: "likes" },
      ]);

      for (const comment of populatedComments) {
        comment.comments = await populateCommentsRecursively(comment.comments);
      }

      return populatedComments;
    };

    // Populate comments recursively for each post
    for (const post of posts) {
      post.comments = await populateCommentsRecursively(post.comments);
    }

    // The `.sort({ createdAt: -1 })` sorts posts by the `createdAt` field in descending order (most recent first).

    // Count the number of posts created before the post to be displayed
    const postNumberPromises = posts.map(async (post) => {
      const postNumber = await Post.countDocuments({
        user: req.params.id,
        createdAt: { $lt: post.createdAt },
      });
      return postNumber;
    });

    const postNumbers = await Promise.all(postNumberPromises);

    const allBooks = await Book.find({ user: req.params.id });
    const books = await Book.find({
      user: req.params.id,
      "completed.type": true,
    });
    const myBooks = await Book.find({
      user: req.user.id,
    });
    const readingBooks = await Book.find({
      user: req.params.id,
      "completed.type": false,
    });
    const favoriteBooks = await Book.find({
      user: req.params.id,
      favorite: true,
    });

    // Convert createdDate for each book to a formatted date string
    const createdCompletedDates = books.map((book) =>
      book.createdAt.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert createdDate for each book to a formatted date string
    const createdReadingDates = readingBooks.map((book) =>
      book.createdAt.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert completed.date for each book to a formatted date string
    const completedDates = books.map((book) =>
      book.completed.date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Convert birthDate to a formatted date string
    const birthDate = DateTime.fromJSDate(profile.birthDate).toLocaleString({
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC", // Set to 'UTC' to match MongoDB's time zone
    });

    res.render("otherProfile.ejs", {
      locals,
      layout: "../views/layouts/otherProfile.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      usersProfile: usersProfile,
      profile: profile,
      user: req.user,
      birthDate: birthDate,
      allBooks: allBooks,
      myBooks: myBooks,
      books: books,
      bookmarks: bookmarks,
      isFollowing: !!isFollowing,
      isFollowed: !!isFollowed,
      followingList: followingList,
      posts: posts,
      postNumbers: postNumbers,
      readingBooks: readingBooks,
      favoriteBooks: favoriteBooks,
      createdCompletedDates: createdCompletedDates,
      createdReadingDates: createdReadingDates,
      completedDates: completedDates,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /profile/changeCoverImg
 */
exports.changeCoverPhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    console.log(req.body);
    console.log(req.file);

    //Modify our image conditionally
    if (req.body.file !== "") {
      const ImgId = profile.cloudinaryCoverPhotoId; //cloudinary id

      if (ImgId) {
        //if the image id exists, we want to delete this image
        await cloudinary.uploader.destroy(ImgId);
      }

      //upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      // Update profile fields
      profile.coverPhoto = result.secure_url;
      profile.cloudinaryCoverPhotoId = result.public_id;

      // Save the changes to the database
      await profile.save();

      // Log the updated profile
      console.log("Cover photo updated successfully");

      res.redirect("/profile");
    } else {
      console.log("No file uploaded");
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /profile/changeProfilePhoto
 */
exports.changeProfilePhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    console.log(req.body);
    console.log(req.file);

    //modify our image conditionally
    if (req.body.file !== "") {
      const ImgId = profile.cloudinaryProfilePicId; //cloudinary id

      if (ImgId) {
        //if the image id exists, we want to delete this image
        await cloudinary.uploader.destroy(ImgId);
      }

      //upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      // Update profile fields
      profile.profilePic = result.secure_url;
      profile.cloudinaryProfilePicId = result.public_id;

      // Save the changes to the database
      await profile.save();

      console.log("Profile photo updated successfully");
      res.redirect("/profile");
    } else {
      console.log("No file uploaded");
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /profile/editProfile
 */
exports.editProfile = async (req, res) => {
  try {
    console.log("Received hobbies:", req.body.hobbies);
    console.log("Received request body:", req.body);

    const profile = await Profile.findOne({ user: req.user.id });

    // Update profile fields
    profile.gender = req.body.gender;
    profile.pronouns = req.body.pronoun;
    profile.profileStatus = req.body.status;
    profile.bio = req.body.bio;

    console.log("Received hobbies:", req.body.hobbies);
    console.log("Received hobbies:", req.body["hobbies[]"]);

    // Filter out empty hobbies and trim whitespace
    profile.hobbies = req.body.hobbies.filter((hobby) => hobby.trim() !== "");

    // Save the changes to the database
    await profile.save();

    console.log("Profile contents updated successfully");

    // Redirect after saving
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    // Send an error response
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Patch /profile/editProfileStatus
 */
exports.editProfileStatus = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Log the request body to see what data is coming in
    console.log(req.body);

    // Assuming your request body looks like { status: 'Public' } or { status: 'Private' }
    const newStatus = req.body.status;

    // Update profile fields
    profile.profileStatus = newStatus;

    // Save the changes to the database
    await profile.save();

    console.log("Profile Status has been updated successfully");

    // Redirect after saving
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    // Send an error response
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Delete /profile/deleteAccount
 */
exports.deleteAccount = async (req, res) => {
  try {
    // Assuming you have the user ID in the request object (e.g., added by passport middleware)
    const userId = req.user.id;

    // Find all books associated with the user
    const books = await Book.find({ user: userId });

    // Delete images from Cloudinary and then delete the books
    for (const book of books) {
      // Delete image from Cloudinary
      if (book.cloudinary) {
        await cloudinary.uploader.destroy(book.cloudinary);
      }
    }

    // Find all posts associated with the user
    const posts = await Post.find({ user: userId })
      .populate({
        path: "likes",
        populate: {
          path: "userInfo", // Populate the userInfo virtual
        },
      })
      .populate({
        path: "comments", // Populate comments
        populate: {
          path: "likes", // Populate likes for comments
          populate: {
            path: "userInfo", // Populate the userInfo virtual for comment likes
          },
        },
      });

    // Loop through each post
    for (const post of posts) {
      // Remove Media Based On MediaType
      if (post.mediaType === "image") {
        await cloudinary.uploader.destroy(post.photo.cloudinary);
      } else if (post.mediaType === "gif") {
        await cloudinary.uploader.destroy(post.gif.cloudinary);
      }

      // Delete all comments and their likes
      await deleteCommentsAndLikes(post.comments);

      // Delete the likes from the post
      await Like.deleteMany({ post: post.id });

      // Delete post from the database
      await Post.deleteOne({ _id: post.id });
    }

    const groups = await Group.find({ creator: userId });

    for (const group of groups) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(group.cloudinary);

      // Delete group from the database
      await Group.deleteOne({ _id: group.id });
    }

    const groupsApartOf = await Group.find({});

    for (const group of groupsApartOf) {
      // Remove the user from the group's members
      group.members.pull(userId);

      // Save the updated group
      await group.save();
    }

    // Delete all comments and likes associated with the user
    await Comment.deleteMany({ user: userId });
    await Like.deleteMany({ user: userId });

    // Delete all books associated with the user
    await Book.deleteMany({ user: userId });

    // Delete all followers and following associated with the user
    await Follow.deleteMany({
      follower: userId,
    });

    await Follow.deleteMany({
      following: userId,
    });

    // Delete all bookmarks associated with the user
    await Bookmark.deleteMany({ user: userId });

    // Delete profile associated with the user
    const profile = await Profile.findOne({ user: userId });
    await cloudinary.uploader.destroy(profile.cloudinaryCoverPhotoId);
    await cloudinary.uploader.destroy(profile.cloudinaryProfilePicId);

    await Profile.deleteOne({ user: userId });

    // Delete user associated with the user
    await User.deleteOne({ _id: userId });

    // Optionally, you may want to log the user out
    req.session.destroy();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    // Send an error response
    res.status(500).send("Internal Server Error");
  }
};

// Helper function to delete comments and their likes recursively
async function deleteCommentsAndLikes(comments) {
  for (const comment of comments) {
    // Remove Media Based On MediaType
    if (comment.mediaType === "image") {
      await cloudinary.uploader.destroy(comment.photo.cloudinary);
    } else if (comment.mediaType === "gif") {
      await cloudinary.uploader.destroy(comment.gif.cloudinary);
    }

    // Delete all child comments and their likes
    await deleteCommentsAndLikes(comment.comments);

    // Delete the likes from the comment
    await Like.deleteMany({ comment: comment.id });

    // Delete the comment itself
    await Comment.deleteOne({ _id: comment.id });
  }
}
