const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a virtual property to populate the associated Post
BookmarkSchema.virtual("postDetails", {
  ref: "Post", // Reference the Post model
  localField: "post", // Field in Bookmark model
  foreignField: "_id", // Field in Post model
});

// // Add virtual fields to populate comments and likes
// BookmarkSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "post",
//   foreignField: "post",
// });

// BookmarkSchema.virtual("likes", {
//   ref: "Like",
//   localField: "post",
//   foreignField: "post",
//   // count: true, // If you set this to true, populate() will set this virtual to the number of populated documents
// });

module.exports = mongoose.model("Bookmark", BookmarkSchema);
