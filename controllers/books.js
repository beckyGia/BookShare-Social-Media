const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Book = require("../models/Book");
const cloudinary = require("../middleware/cloudinary");

/**
 * Post /books/addCompleted
 */
exports.addCompleted = async (req, res) => {
  try {
    console.log("req.files", req.files);
    console.log("req.file", req.file);
    // console.log("req.file.buffer", req.file.buffer);
    console.log("req.body.imageUrls", req.body.imageUrls);
    console.log("req.body", req.body);
    // console.log(req.body.synopsis);
    // console.log(req.body.genres);
    let result;

    if (req.body.imageUrls !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.body.imageUrls, {
        folder: "bookShareApp",
      });
    } else {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
    }

    const genres = req.body.genres.filter((genre) => genre.trim() !== "");

    let synopsis = req.body.synopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.title,
      author: req.body.author,
      synopsis: cleanedSynopsis,
      status: req.body.status,
      genres: genres,
      rating: req.body.rating,
      user: req.user.id,
      // Set completed and date fields based on your logic
      completed: {
        type: true, // Set to true or false based on your logic
        date: new Date(), // Set the date based on your logic
      },
    });
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Post /books/addReading
 */
exports.addReading = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    let result;

    if (req.body.imageUrls !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.body.imageUrls, {
        folder: "bookShareApp",
      });
    } else {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
    }

    const genres = req.body.genres.filter((genre) => genre.trim() !== "");

    let synopsis = req.body.synopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.title,
      author: req.body.author,
      synopsis: cleanedSynopsis,
      status: req.body.status,
      genres: genres,
      rating: req.body.rating,
      user: req.user.id,
    });

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Post /books/addReadingProfile
 */
exports.addReadingProfile = async (req, res) => {
  try {
    // console.log(req.body);
    let result = await cloudinary.uploader.upload(req.body.bookCoverPhoto, {
      folder: "bookShareApp",
    });

    const genres = req.body.bookGenres.split(",");

    let synopsis = req.body.bookSynopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    // console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      synopsis: cleanedSynopsis,
      status: "Public",
      genres: genres,
      user: req.user.id,
    });

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Post /books/addReadingPost
 */
exports.addReadingPost = async (req, res) => {
  try {
    // console.log(req.body);
    let result = await cloudinary.uploader.upload(req.body.bookCoverPhoto, {
      folder: "bookShareApp",
    });

    const genres = req.body.bookGenres.split(",");

    let synopsis = req.body.bookSynopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    // console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      synopsis: cleanedSynopsis,
      status: "Public",
      genres: genres,
      user: req.user.id,
    });

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Post /books/addReadingPostDashboard
 */
exports.addReadingPostDashboard = async (req, res) => {
  try {
    // console.log(req.body);
    let result = await cloudinary.uploader.upload(req.body.bookCoverPhoto, {
      folder: "bookShareApp",
    });

    const genres = req.body.bookGenres.split(",");

    let synopsis = req.body.bookSynopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    // console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      synopsis: cleanedSynopsis,
      status: "Public",
      genres: genres,
      user: req.user.id,
    });

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Post /books/addReadingPostBookmark
 */
exports.addReadingPostBookmark = async (req, res) => {
  try {
    // console.log(req.body);
    let result = await cloudinary.uploader.upload(req.body.bookCoverPhoto, {
      folder: "bookShareApp",
    });

    const genres = req.body.bookGenres.split(",");

    let synopsis = req.body.bookSynopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    // console.log(cleanedSynopsis);

    await Book.create({
      bookCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      synopsis: cleanedSynopsis,
      status: "Public",
      genres: genres,
      user: req.user.id,
    });

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /books/editBook/:id
 */
exports.editBook = async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    console.log("req.file", req.file);
    console.log("req.body.editImageUrls", req.body.editImageUrls);

    //Find book by id
    let book = await Book.findById({ _id: req.params.id });

    let result;

    if (req.body.editImageUrls !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.body.editImageUrls, {
        folder: "bookShareApp",
      });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(book.cloudinary);
    } else if (req.files !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(book.cloudinary);
    } else {
      // Use the existing image
      result = {
        secure_url: book.bookCoverPhoto,
        public_id: book.cloudinary,
      };
    }

    const genres = req.body.genres.filter((hobby) => hobby.trim() !== "");

    let synopsis = req.body.synopsis;
    let cleanedSynopsis = synopsis.replace(/\s+/g, " ");
    console.log(cleanedSynopsis);

    // Update book fields
    book.bookCoverPhoto = result.secure_url;
    book.cloudinary = result.public_id;
    book.title = req.body.title;
    book.author = req.body.author;
    book.synopsis = cleanedSynopsis;
    book.status = req.body.status;
    book.genres = genres;
    book.rating = req.body.rating;

    // Save the changes to the database
    await book.save();

    console.log(`Book ${book._id} has been updated successfully`);

    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/addEditRating/:id
 */
exports.addEditRating = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        rating: req.body.rating,
      }
    );
    console.log("Added Rating");
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/addEditFavoriteRating/:id
 */
exports.addEditFavoriteRating = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        rating: req.body.rating,
      }
    );
    console.log("Added Rating");
    res.redirect("/dashboard/favorites");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/markFavorite/:id
 */
exports.markFavorite = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        favorite: true,
      }
    );
    console.log("Marked Complete");
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/unFavorite/:id
 */
exports.unFavorite = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        favorite: false,
      }
    );
    console.log("Marked unFavorite");
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/unFavoriteFromFavorites/:id
 */
exports.unFavoriteFromFavorites = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        favorite: false,
      }
    );
    console.log("Marked unFavorite");
    res.redirect("/dashboard/favorites");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/markComplete/:id
 */
exports.markComplete = async (req, res) => {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          "completed.type": true,
          "completed.date": Date.now(),
        },
      },
      { new: true } // to return the updated document
    );
    console.log("Marked Complete");
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Patch /books/deleteFromReadingList/:id
 */
exports.deleteFromReadingList = async (req, res) => {
  try {
    //Find book by id
    let book = await Book.findById({ _id: req.params.id });

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(book.cloudinary);

    //Delete Book from the database
    await Book.deleteOne({ _id: req.params.id });

    console.log("Deleted Book");
    res.redirect("/dashboard/readingList");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Delete /books/deleteBook/:id
 */
exports.deleteBook = async (req, res) => {
  try {
    //Find book by id
    let book = await Book.findById({ _id: req.params.id });

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(book.cloudinary);

    //Delete Book from the database
    await Book.deleteOne({ _id: req.params.id });

    console.log("Deleted Book");
    res.redirect("/dashboard/bookList");
  } catch (err) {
    console.log(err);
  }
};
