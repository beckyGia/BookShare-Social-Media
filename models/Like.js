const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference the Post model
    // required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
});

// Define a virtual for user information from the User model
LikeSchema.virtual("userInfo", {
  ref: "Profile",
  localField: "user",
  foreignField: "user",
  justOne: true,
});

// Populate the userInfo virtual when querying the Like model
LikeSchema.pre("find", function () {
  this.populate("userInfo");
});

// Define a virtual field for user information in the Like schema
LikeSchema.virtual("userProfile").get(function () {
  if (this.userInfo) {
    return {
      fullName: this.userInfo.fullName,
      profilePic: this.userInfo.profilePic,
      profile: this.userInfo._id,
    };
  } else {
    return {
      fullName: "Unknown",
      profilePic:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    };
  }
});

module.exports = mongoose.model("Like", LikeSchema);
