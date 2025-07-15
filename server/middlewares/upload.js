const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "evently",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = parser;
