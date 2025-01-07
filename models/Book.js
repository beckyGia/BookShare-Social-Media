const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    bookCoverPhoto: {
      type: String,
      required: true,
    },
    cloudinary: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
      maxLength: 900,
    },
    status: {
      type: String,
      default: "Public",
      enum: ["Public", "Friends", "Private"],
    },
    genres: [
      {
        type: String,
        required: false,
      },
    ],
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        validate: {
          validator: function () {
            // Only validate if the completed field is true
            return this.completed.type === true;
          },
          message: "Date should only be provided when completed is true",
        },
      },
    },
  },
  {
    timestamps: true, //both createdAt and updatedAt
  }
);

module.exports = mongoose.model("Books", BookSchema);
