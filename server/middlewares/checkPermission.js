// Models
const { default: mongoose } = require("mongoose");

const checkPermission = (objectInput) => async (req, res, next) => {
  const objectId = req.params.id;

  if (!mongoose.isValidObjectId(objectId)) {
    return res.status(400).json({
      success: false,
      message: "Object id is not a valid ObjectId",
    });
  }

  try {
    const object = await objectInput.findById(objectId);

    if (!object) {
      return res.status(404).json({
        success: false,
        message: "Requested object was not found",
      });
    }

    if (req.user.role === "admin" || object.author.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

module.exports = checkPermission;
