const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Public", "Friends", "Private"], // Add other types as needed
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "gif", "book", "none"], // Add other types as needed
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
    book: {
      title: {
        type: String,
        required: function () {
          // Require title if mediaType is "book"
          return this.mediaType === "book";
        },
      },
      author: {
        type: String,
        required: function () {
          // Require author if mediaType is "book"
          return this.mediaType === "book";
        },
      },
      bookCoverPhoto: { type: String },
      synopsis: { type: String },
      genres: [
        {
          type: String,
          required: false,
        },
      ],
    },
  },
  {
    timestamps: true, //both createdAt and updatedAt
    toObject: { virtuals: true },
  }
);

// Define a virtual field to retrieve the user's full name
PostSchema.virtual("userProfile", {
  ref: "Profile", // Reference to the Profile model
  localField: "user", // The field in this schema (Post) that links to the User model
  foreignField: "user", // The field in the Profile schema that links to the User model
  justOne: true, // We expect just one profile
});

// Define a virtual field for formattedCreatedAt
PostSchema.virtual("formattedCreatedAt").get(function () {
  const now = new Date();
  const diffMilliseconds = now - this.createdAt;
  const minutes = Math.floor(diffMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  } else if (minutes > 0) {
    return `${minutes}min${minutes > 1 ? "s" : ""}`;
  } else {
    return "just now";
  }
});

// Define a virtual field for formattedUpdatedAt
// Define a virtual field for formattedUpdatedAt
PostSchema.virtual("formattedUpdatedAt").get(function () {
  const now = new Date();
  const diffMilliseconds = now - this.updatedAt;
  const minutes = Math.floor(diffMilliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes % 60} min ago`;
  } else if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
});

// Populate the userProfile virtual when querying the Post model
PostSchema.pre("find", function () {
  this.populate("userProfile");
});

// Define the userFullName virtual field
PostSchema.virtual("usersFullName").get(function () {
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

//In our case we want to populate the post schema:
PostSchema.virtual("comments", {
  //comments is the name we are giving it
  ref: "Comment", //what model are we referencing
  localField: "_id", // Find comments where `localField`
  foreignField: "post",
});
PostSchema.virtual("likes", {
  ref: "Like", //what model are we referencing
  localField: "_id", // Find comments where `localField`
  foreignField: "post",
  // count: true, //If you set this to true, populate() will set this virtual to the number of populated documents, as opposed to the documents themselves, using Query#countDocuments().
});

module.exports = mongoose.model("Post", PostSchema);
