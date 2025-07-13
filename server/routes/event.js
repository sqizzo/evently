const express = require("express");
const router = express.Router();

// Models
const Event = require("../models/Event");

// Utils
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const { body, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Route: /events
// Method: GET
// Header: -
// Query: -
// Body: -
// Test: Success
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate("author", "email username");

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

// Route: /events/:id
// Method: GET
// Header: Authorization Token
// Query: id (params)
// Body: -
// Test: Success
router.get("/:id/detail", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Event id is not a valid ObjectId",
    });
  }

  try {
    const event = await Event.findById(id).populate("author", "username email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event was not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event was found",
      data: {
        event,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

// Route: /events/create
// Method: POST
// Header: Authorization Token
// Query: -
// Body: name, description, startDate, endDate, location, bannerUrl, ticketPrice, category
// Test: Success
router.post(
  "/create",
  authMiddleware,
  [
    body("name").trim().notEmpty().withMessage("Event name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Event description is required"),
    body("startDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Start date must be a valid date format"),
    body("endDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("End date must be a valid date format"),
    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isString()
      .withMessage("Location must be a string"),
    body("bannerUrl")
      .optional()
      .isString()
      .withMessage("Banner url must be a string"),
    body("ticketPrice")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Ticket price must be a number"),
    body("category")
      .optional()
      .isIn([
        "seminar",
        "workshop",
        "webinar",
        "concert",
        "festival",
        "conference",
        "competition",
        "meetup",
        "sports",
        "exhibition",
        "charity",
        "others",
      ])
      .withMessage("Invalid category"),
  ],
  async (req, res) => {
    const {
      name,
      description,
      startDate,
      endDate,
      location,
      bannerUrl,
      ticketPrice,
      category,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    try {
      const newEvent = await Event.create({
        name,
        description,
        startDate,
        endDate,
        location,
        bannerUrl,
        ticketPrice,
        category,
        author: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Event added succesfully",
        data: {
          event: newEvent,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal server error",
      });
    }
  }
);

// Route: /events/:id/edit
// Method: PUT
// Header: Authorization Token
// Query: -
// Body: name, description, startDate, endDate, location, bannerUrl, ticketPrice, category
// Test: Success
router.put(
  "/:id/edit",
  authMiddleware,
  checkPermission(Event),
  [
    body("name").trim().notEmpty().withMessage("Event name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Event description is required"),
    body("startDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Start date must be a valid date format"),
    body("endDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("End date must be a valid date format"),
    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isString()
      .withMessage("Location must be a string"),
    body("bannerUrl")
      .optional()
      .isString()
      .withMessage("Banner url must be a string"),
    body("ticketPrice")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Ticket price must be a number"),
    body("category")
      .optional()
      .isIn([
        "seminar",
        "workshop",
        "webinar",
        "concert",
        "festival",
        "conference",
        "competition",
        "meetup",
        "sports",
        "exhibition",
        "charity",
        "others",
      ])
      .withMessage("Invalid category"),
  ],
  async (req, res) => {
    const updateFields = { ...req.body };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    try {
      const id = req.params.id;

      const event = await Event.findOneAndUpdate({ _id: id }, updateFields, {
        new: true,
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event was not found",
          data: {
            event,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error?.message || "Internal server error",
      });
    }
  }
);

// Route: /events/:id
// Method: DELETE
// Header: Authorization Token
// Query: id (params)
// Body: -
// Test: Success
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(Event),
  async (req, res) => {
    try {
      const id = req.params.id;

      const event = await Event.findOneAndDelete({ _id: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event was not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event successfully deleted",
        data: {
          event,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal server error",
      });
    }
  }
);

// Route: /events/:id/bookmark
// Method: PATCH
// Header: Authorization Token
// Query: id (params)
// Body: -
// Test:
// router.patch("/:id/bookmark", authMiddleware, async (req, res) => {

// });

module.exports = router;
