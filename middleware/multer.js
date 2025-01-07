const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase(); //the .toLowerCase is to catch any edge cases where the png is .PNG instead, this will allow that to be uploaded, otherwise we will get a file error
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
  // limits: {
  //   // fields: 10,
  //   fileSize: 1024 * 1024 * 25, // 25MB limit (or other limit as needed)
  // },
});
