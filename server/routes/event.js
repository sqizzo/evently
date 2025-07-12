const express = require("express");
const router = express.Router();

// Models
const Event = require("../models/Event");

// Utils
const authMiddleware = require("../middlewares/authMiddleware");

// Route: /events
// Method: GET
// Header: -
// Query: -
// Body: -
// Test:
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Get all events success",
      data: {
        events,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
});

module.exports = router;
