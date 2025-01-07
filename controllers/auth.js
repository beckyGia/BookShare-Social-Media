const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const cloudinary = require("../middleware/cloudinary");

/**
 * Get /auth/login
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }

  const locals = {
    title: "BookShare - Login Page",
    description: "A Book Sharing Social Media App Login Page",
  };
  const messages = req.flash();
  res.render("login.ejs", {
    locals,
    layout: "../views/layouts/auth.ejs",
    messages: messages,
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!req.body.password || validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/auth/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/auth/login");
    }

    try {
      req.logIn(user, async (err) => {
        if (err) {
          return next(err);
        }

        // Check if the user has completed the signup process
        if (!user.signupCompleted) {
          req.flash("info", {
            msg: "Welcome! Please complete your details to continue.",
          });
          return res.redirect("/auth/details"); // Redirect to details form
        }

        // Check if the user has completed their profile
        const userProfile = await Profile.findOne({ user: user._id });

        console.log("User Profile:", userProfile);
        if (!userProfile || !userProfile.completed) {
          console.log("Profile not completed. Redirecting to /auth/details");
          req.flash("info", {
            msg: "Complete your profile to get started.",
          });
          return res.redirect("/auth/details"); // Redirect to details form
        }

        console.log("Profile completed. Redirecting to /profile");
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/profile");
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

/**
 * Get /auth/signup
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/dashboard");
  }

  const locals = {
    title: "BookShare - Signup Page",
    description: "A Book Sharing Social Media App Signup Page",
  };
  const messages = req.flash();
  res.render("signup.ejs", {
    locals,
    layout: "../views/layouts/auth.ejs",
    messages: messages,
  });
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/auth/signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("/auth/signup");
    }

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    // Set the signupCompleted flag to true
    user.signupCompleted = true;
    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/auth/details");
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get /auth/details
 */
exports.getDetails = (req, res) => {
  // Check if the user has completed the signup process
  if (!req.user.signupCompleted) {
    // Redirect to the signup page or any other appropriate page
    return res.redirect("/auth/signup");
  }

  const locals = {
    title: "BookShare - Create A New Profile",
    description: "A Book Sharing Social Media App - Create A New Profile",
  };
  const message = req.flash();

  res.render("detailsform.ejs", {
    locals,
    layout: "../views/layouts/details.ejs",
    message: message,
  });
};

exports.postDetails = async (req, res) => {
  try {
    // Check if the user already has a profile
    const existingProfile = await Profile.findOne({ user: req.user.id });

    if (existingProfile) {
      console.log("User already has a profile. Redirecting to profile page.");
      return res.redirect("/profile");
    }

    // Check if a profile picture file is provided
    if (!req.files || !req.files.file) {
      console.error("No profile picture uploaded.");
      return res.status(400).send("Bad Request: No profile picture uploaded.");
    }

    let hobbies;

    if (req.body.hobbies) {
      hobbies = JSON.parse(req.body.hobbies);
      console.log("Received hobbies:", hobbies);
    } else {
      hobbies = "";
      console.log("Received hobbies:", hobbies);
    }

    // Upload image to Cloudinary (assuming a profile picture is uploaded)
    const profilePicResult = await cloudinary.uploader.upload(
      req.files.file[0].path,
      {
        folder: "bookShareApp",
      }
    );

    // Declare coverPhotoResult with a default value
    let coverPhotoResult;

    // Upload cover photo to Cloudinary (assuming a cover photo is uploaded && if coverFile is present)
    if (req.files.coverFile) {
      coverPhotoResult = await cloudinary.uploader.upload(
        req.files.coverFile[0].path,
        {
          folder: "bookShareApp",
        }
      );
    } else {
      // If no cover photo is provided, use a default cover photo URL
      coverPhotoResult = await cloudinary.uploader.upload(
        "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80",
        {
          folder: "bookShareApp",
        }
      );
    }

    // Create a new profile
    const newProfile = await Profile.create({
      profilePic: profilePicResult.secure_url,
      cloudinaryProfilePicId: profilePicResult.public_id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      birthDate: new Date(
        `${req.body.birthYear}-${req.body.birthMonth}-${req.body.birthDay}`
      ),
      gender: req.body.gender,
      pronouns: req.body.pronoun,
      profileStatus: req.body.status,
      bio: req.body.bio,
      hobbies: hobbies,
      coverPhoto: coverPhotoResult.secure_url,
      cloudinaryCoverPhotoId: coverPhotoResult.public_id,
      user: req.user.id,
    });

    // Update the completed flag
    if (newProfile) {
      newProfile.completed = true;
      await newProfile.save(); // Save the changes to the database
    }

    console.log("Profile created successfully!");
    res.redirect("/profile");
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get /auth/logout
 */

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err)
        console.log(
          "Error : Failed to destroy the session during logout.",
          err
        );
      req.user = null;
      console.log("User has logged out.");
      res.redirect("/");
    });
  });
};
