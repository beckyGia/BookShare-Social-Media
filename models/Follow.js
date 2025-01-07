const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
  }
);

// Define a virtual field to retrieve the following user's profile
FollowSchema.virtual("followingProfile", {
  ref: "Profile",
  localField: "following",
  foreignField: "user",
  justOne: true,
});

// Virtual to populate the 'followingUserName' field from the associated User model
FollowSchema.virtual("followingUserName", {
  ref: "User", // Reference to the User model
  localField: "following", // The field in this schema (Follow) that links to the User model
  foreignField: "_id", // The field in the User schema that links to the _id field
  justOne: true, // We expect just one user
  select: "userName", // Select only the 'userName' field from User
});

// Populate the followerProfile and followingProfile virtuals when querying the Follow model
FollowSchema.pre("find", function () {
  this.populate("followingProfile");
});

const Follow = mongoose.model("Follow", FollowSchema);

module.exports = Follow;
