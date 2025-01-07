//REQUIRED DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/db");

//Main Routes:
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const dashboardRoutes = require("./routes/dashboard");
const booksRoutes = require("./routes/books");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const followRoutes = require("./routes/follow");
const groupRoutes = require("./routes/group");
const bookmarkRoutes = require("./routes/bookmark");
// const externalAPIRoutes = require("./routes/externalAPI");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//how to fix Mongoose Deprecation Warning "the strictQuery"
mongoose.set("strictQuery", false);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout", "./layouts/main");

//Body Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.complete = req.flash("complete");
  res.locals.user = req.user;
  next();
});

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/books", booksRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/follow", followRoutes);
app.use("/group", groupRoutes);
app.use("/bookmark", bookmarkRoutes);
// app.use("/api", externalAPIRoutes);

//SET UP PORT:
const PORT = process.env.PORT || 7000;

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
