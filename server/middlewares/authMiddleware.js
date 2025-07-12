const jwt = require("jsonwebtoken");

// Purpose: To verify whether the request contains jwt token
const authMiddleware = (req, res, next) => {
  const tokenHeader = req.get("Authorization");

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Missing/malformed token" });
  }
  const token = tokenHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
