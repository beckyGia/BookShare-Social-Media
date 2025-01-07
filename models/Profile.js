const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      require: true,
    },
    cloudinaryProfilePicId: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: false,
    },
    birthDate: {
      type: Date,
      require: true,
    },
    profileStatus: {
      type: String,
      default: "Public",
      enum: ["Public", "Private"],
      require: true,
    },
    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Transgender",
        "Nonbinary",
        "Other",
        "Prefer Not To Say",
      ],
      require: true,
    },
    pronouns: {
      type: String,
      enum: ["Feminine", "Masculine", "Neutral"],
      require: true,
    },
    bio: {
      type: String,
      require: true,
      maxLength: 100, // Set the maximum number of characters allowed
    },
    hobbies: [
      {
        type: String,
        required: false,
      },
    ],
    coverPhoto: {
      type: String,
      require: false,
      default:
        "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80",
    },
    cloudinaryCoverPhotoId: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    virtuals: {
      fullName: {
        type: String,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  },
  {
    timestamps: true, //both createdAt and updatedAt
  }
);

// Virtual to populate the 'username' field from the associated User model
ProfileSchema.virtual("userName", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  select: "userName", // select only the 'userName' field from User
});

// Virtual to check if the required fields are filled out
ProfileSchema.virtual("requiredFieldsCompleted").get(function () {
  return !!(
    this.profilePic &&
    this.firstName &&
    this.lastName &&
    this.birthDate &&
    this.gender &&
    this.pronouns &&
    this.bio
  );
});

// Set the 'toObject' option for including virtuals when converting to JSON
ProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Profile", ProfileSchema);
