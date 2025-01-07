const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      // required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "gif", "none"], // Add other types as needed
      required: true,
    },
    photo: {
      image: { type: String },
      cloudinary: { type: String },
    },
    gif: {
      image: { type: String },
      cloudinary: { type: String },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // will allow only certain people to delete a comment
      ref: "User",
      autopopulate: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    deleted: { type: Boolean },
    edited: { type: Boolean },
  },
  {
    timestamps: true, //both createdAt and updatedAt
    toObject: { virtuals: true },
  }
);

// Define a virtual field to retrieve the user's full name
CommentSchema.virtual("userProfile", {
  ref: "Profile", // Reference to the Profile model
  localField: "user", // The field in this schema (Comment) that links to the User model
  foreignField: "user", // The field in the Profile schema that links to the User model
  justOne: true, // We expect just one profile
});

// Define a virtual field for formattedCreatedAt
CommentSchema.virtual("formattedCreatedAt").get(function () {
  const now = new Date();
  const diffMilliseconds = now - this.createdAt;
  const minutes = Math.floor(diffMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return "just now";
  }
});

// Define a virtual field for formattedUpdatedAt
CommentSchema.virtual("formattedUpdatedAt").get(function () {
  const now = new Date();
  const diffMilliseconds = now - this.updatedAt;
  const minutes = Math.floor(diffMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return "just now";
  }
});

// Populate the userProfile virtual when querying the Comment model
CommentSchema.pre("find", function () {
  this.populate("userProfile");
});

// Define the userFullName virtual field
CommentSchema.virtual("usersFullName").get(function () {
  if (this.userProfile) {
    return {
      fullName: this.userProfile.fullName,
      profilePic: this.userProfile.profilePic,
    };
  } else {
    return {
      fullName: "Unknown",
      profilePic:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg", // Provide a default URL if needed
    };
  }
});

//now if we wanted to find all the comments on our comment, what we are going to do, instead of making a while loop and calling all the things, we are going to be adding another virtual populate
CommentSchema.virtual("comments", {
  //comments is the name we are giving it
  ref: "Comment", //what model are we referencing
  localField: "_id", // Find comments where `localField`
  foreignField: "comment",
  autopopulate: true,
});

CommentSchema.virtual("likes", {
  ref: "Like", //what model are we referencing
  localField: "_id", // Find comments where `localField`
  foreignField: "comment",
  //   count: true, // If you set this to true, populate() will set this virtual to the number of populated documents, as opposed to the documents themselves, using Query#countDocuments().
});

CommentSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Comment", CommentSchema);
