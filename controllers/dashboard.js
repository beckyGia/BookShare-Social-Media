const passport = require("passport");
const mongoose = require("mongoose");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Book = require("../models/Book");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Follow = require("../models/Follow");
const {
  Group,
  checkDefaultGroupsCreated,
  createDefaultGroups,
} = require("../models/Group");
const cloudinary = require("../middleware/cloudinary");
const { DateTime } = require("luxon");
const Bookmark = require("../models/Bookmark");

/**
 * Get /dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Dashboard",
    };

    const profile = await Profile.findOne({ user: req.user.id });

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    // Find all the people you are following
    const followingList = await Follow.find({ follower: req.user.id })
      .populate("followingProfile")
      .populate("followingUserName");

    // Extract user IDs from followingList
    const followingListIds = followingList.map((user) => user.following);

    // Include the logged-in user ID in the array
    followingListIds.push(req.user.id);

    // Find posts directly related to users in the followingList
    const posts = await Post.find({ user: { $in: followingListIds } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "likes",
        populate: {
          path: "userInfo",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "likes",
          populate: {
            path: "userInfo",
          },
        },
      });

    // Count the number of posts created before the post to be displayed
    const postNumberPromises = posts.map(async (post) => {
      const postNumber = await Post.countDocuments({
        user: { $in: followingListIds },
        createdAt: { $lt: post.createdAt },
      });
      return postNumber;
    });

    const postNumbers = await Promise.all(postNumberPromises);

    const allBooks = await Book.find({ user: req.user.id });

    // Call createDefaultGroups
    const defaultGroupsCreated = await checkDefaultGroupsCreated();

    if (!defaultGroupsCreated) {
      await createDefaultGroups();
    }

    const groups = await Group.find({}).sort({
      createdAt: -1,
    });
    // console.log(groups);

    const bookmarks = await Bookmark.find({ user: req.user.id });

    const message = req.flash();

    res.render("dashboard.ejs", {
      locals,
      layout: "../views/layouts/dashboard.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      profile: profile,
      posts: posts,
      allBooks: allBooks,
      postNumbers: postNumbers,
      userName: populatedProfile,
      groups: groups,
      bookmarks: bookmarks,
      user: req.user,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Dashboard");
  }
};

/**
 * Put /post/editPostDashboard/:postId
 */
exports.editPostDashboard = async (req, res) => {
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
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while editing this post.");
  }
};

/**
 * Put /dashboard/likePostDashboard/:postId
 */
exports.likePostDashboard = async (req, res) => {
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
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the post.");
  }
};

/**
 * Put /dashboard/likePostBookmarks/:postId
 */
exports.likePostBookmarks = async (req, res) => {
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
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while liking the post.");
  }
};

/**
 * Put /dashboard/unlikePostDashboard/:postId
 */
exports.unlikePostDashboard = async (req, res) => {
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
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the post.");
  }
};

/**
 * Put /dashboard/unlikePostBookmarks/:postId
 */
exports.unlikePostBookmarks = async (req, res) => {
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
    res.redirect("/dashboard/bookmarks");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while unliking the post.");
  }
};

/**
 * Delete /post/deletePostDashboard/:postId
 */
exports.deletePostDashboard = async (req, res) => {
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

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the post.");
  }
};

/**
 * Get /dashboard/bookList
 */
exports.getBookList = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App BookList",
    };

    const profile = await Profile.findOne({ user: req.user.id });
    const books = await Book.find({
      user: req.user.id,
      "completed.type": true,
    });

    // Convert createdDate for each book to a formatted date string
    const createdDates = books.map((book) =>
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

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    const message = req.flash();

    res.render("book.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      profile: profile,
      books: books,
      userName: populatedProfile,
      user: req.user,
      createdDates: createdDates,
      completedDates: completedDates,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Book List");
  }
};

/**
 * Get /dashboard/readingList
 */
exports.getReadingList = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App ReadingList",
    };

    const profile = await Profile.findOne({ user: req.user.id });
    const books = await Book.find({
      user: req.user.id,
      "completed.type": false,
    });

    // Convert createdDate for each book to a formatted date string
    const createdDates = books.map((book) =>
      book.createdAt.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    const message = req.flash();

    res.render("readingList.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      profile: profile,
      books: books,
      userName: populatedProfile,
      user: req.user,
      createdDates: createdDates,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Reading List");
  }
};

/**
 * Get /dashboard/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App ReadingList",
    };

    const profile = await Profile.findOne({ user: req.user.id });
    const books = await Book.find({ user: req.user.id, favorite: true });

    // Convert createdDate for each book to a formatted date string
    const createdDates = books.map((book) =>
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

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    const message = req.flash();

    res.render("favorites.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      giphyApiKey: process.env.GIPHY_API_KEY,
      message: message,
      profile: profile,
      books: books,
      userName: populatedProfile,
      user: req.user,
      createdDates: createdDates,
      completedDates: completedDates,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Favorites");
  }
};

/**
 * Get /dashboard/groups
 */
exports.getGroups = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Groups",
    };
    const profile = await Profile.findOne({ user: req.user.id });

    const userId = req.user.id; // Assuming you have the user's ID

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    // Find Groups You Are Part Of:
    const groupsMemberOf = await Group.find({
      members: { $in: [userId] },
    });
    // Find Groups You Can Join:
    const groupsNotMemberOf = await Group.find({
      members: { $nin: [userId] },
    });

    const message = req.flash();

    res.render("groups.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      message: message,
      profile: profile,
      giphyApiKey: process.env.GIPHY_API_KEY,
      userName: populatedProfile,
      groupsMemberOf: groupsMemberOf,
      groupsNotMemberOf: groupsNotMemberOf,
      user: req.user,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Groups");
  }
};

/**
 * Get /dashboard/bookmarks
 */
exports.getBookmarks = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Bookmarks",
    };

    const profile = await Profile.findOne({ user: req.user.id });

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    const allBooks = await Book.find({ user: req.user.id });

    const bookmarks = await Bookmark.find({ user: req.user.id }).populate({
      path: "postDetails",
      populate: {
        path: "comments likes", // Populate comments and likes for each post
      },
    });

    const message = req.flash();

    res.render("bookmarks.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      message: message,
      profile: profile,
      allBooks: allBooks,
      giphyApiKey: process.env.GIPHY_API_KEY,
      userName: populatedProfile,
      bookmarks: bookmarks,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Bookmarks");
  }
};

/**
 * Get /dashboard/friends
 */
exports.getFriends = async (req, res) => {
  try {
    const locals = {
      title: "BookShare",
      description: "A Book Sharing Social Media App Friends",
    };

    const profile = await Profile.findOne({ user: req.user.id });

    // Assuming 'profile' is the Mongoose profile model instance
    const populatedProfile = await profile.populate("userName");

    // Find all the people you are following
    const followingList = await Follow.find({ follower: req.user.id })
      .populate("followingProfile")
      .populate("followingUserName");

    //Find the rest of the people on Bookshare you are not following
    const userItems = await User.find({
      _id: {
        $ne: req.user.id, // Exclude the current user
        $nin: followingList.map((item) => item.following), // Exclude users from your following list
      },
    });

    // Extract user IDs from userItems
    const userItemIds = userItems.map(
      (user) => new mongoose.Types.ObjectId(user._id)
    );
    console.log("userItemIds", userItemIds);

    // Logged in User Info:
    const loggedInUserId = req.user.id;

    //Find Mutual Friends
    const findMutualFriends = async (loggedInUserId, targetUserId) => {
      // Find the users that the logged-in user is following
      const followingList = (
        await Follow.find({ follower: loggedInUserId }).distinct("following")
      ).map(String);

      // Find mutual friends with the target user
      const targetUserFollowingList = (
        await Follow.find({ follower: targetUserId }).distinct("following")
      ).map(String);

      const mutualFriends = followingList.filter((userId) =>
        targetUserFollowingList.includes(userId)
      );

      return {
        mutual: mutualFriends.map((userId) => ({ _id: userId })), // Map to an array of user objects
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

    // Iterate through each user in the userItems array
    for (const user of userItems) {
      const result = await findMutualFriends(req.user.id, user._id);
      user.mutualFriends = result.mutual;
      user.mutualFriendsCount = result.count;

      // Fetch profiles for each mutual friend
      const mutualFriendsProfiles = await Profile.find({
        user: { $in: result.mutual.map((friend) => friend._id) },
      }).populate("userName"); // Populate the userName field

      // Attach the profiles to the user object
      user.mutualFriendsProfiles = mutualFriendsProfiles;
    }

    console.log("loggedUsers", loggedInUserId);

    // Find profiles for users in userItems
    const profileItems = await Profile.find({ user: { $in: userItemIds } });

    const message = req.flash();

    res.render("friends.ejs", {
      locals,
      layout: "../views/layouts/book.ejs",
      message: message,
      profile: profile,
      userName: populatedProfile,
      followingList: followingList,
      giphyApiKey: process.env.GIPHY_API_KEY,
      users: userItems,
      usersProfile: profileItems,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., render an error page or redirect
    res.status(500).send("Error Occurred Trying To Get Your Friends List");
  }
};
