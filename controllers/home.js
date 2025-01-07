const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");

/**
 * Get /getIndex
 */
exports.getIndex = async (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App",
  };
  const message = req.flash();

  res.render("index.ejs", {
    locals,
    layout: "../views/layouts/index.ejs",
    message: message,
  });
};

/**
 * Get /otherProfile
 */
exports.getOtherProfile = (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App Profile",
  };
  const message = req.flash();

  res.render("otherProfile.ejs", {
    locals,
    layout: "../views/layouts/profile.ejs",
    giphyApiKey: process.env.GIPHY_API_KEY,
    message: message,
  });
};

/**
 * Get /favorites
 */
exports.getFavorites = (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App Favorites",
  };
  const message = req.flash();

  res.render("favorites.ejs", {
    locals,
    layout: "../views/layouts/book.ejs",
    message: message,
  });
};

/**
 * Get /groups
 */
exports.getGroups = (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App Groups",
  };
  const message = req.flash();

  res.render("groups.ejs", {
    locals,
    layout: "../views/layouts/book.ejs",
    message: message,
  });
};

/**
 * Get /friends
 */
exports.getFriends = (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App Friends",
  };
  const message = req.flash();

  res.render("friends.ejs", {
    locals,
    layout: "../views/layouts/book.ejs",
    message: message,
  });
};

/**
 * Get /discussion
 */
exports.getDiscussion = (req, res) => {
  const locals = {
    title: "BookShare",
    description: "A Book Sharing Social Media App Discussion",
  };
  const message = req.flash();

  res.render("discussion.ejs", {
    locals,
    layout: "../views/layouts/dashboard.ejs",
    message: message,
  });
};
