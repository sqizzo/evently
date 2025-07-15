function multerErrorHandler(err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too big for 2MB maximum size.",
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || "Multer error",
  });
}

module.exports = multerErrorHandler;
