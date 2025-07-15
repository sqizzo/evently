const express = require("express");
const router = express.Router();

// Models
const Event = require("../models/Event");
const User = require("../models/User");

// Utils
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const { body, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const parser = require("../middlewares/upload");

// Route: /events
// Method: GET
// Header: -
// Query: page, category, filter
// Body: -
// Test: Success
router.get("/", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const filter = req.query.search;

  const query = {};

  // pakai query search & category kalau ada aja
  if (category) query.category = category;
  if (filter) query.name = { $regex: `${filter}`, $options: "i" };

  // lewati berapa data pertama
  const skip = (page - 1) * limit;
  try {
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "email username");

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      success: true,
      message: "Get all events success",
      data: {
        events,
        pagination: {
          totalEvents,
          totalPages,
          currentPage: page,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
});

// Route: /events/:id/detail
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
  parser.single("banner-image"),
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
      ticketPrice,
      category,
    } = req.body;

    const bannerUrl = (await req.file)
      ? await req.file.path
      : "https://example.com/default-event-banner.jpg";

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
        message: "Internal server error",
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
  parser.single("banner-image"),
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
    let bannerUrl;
    let updateFields;
    if (await req.file) bannerUrl = req.file.path;

    if (bannerUrl !== undefined) {
      updateFields = { bannerUrl, ...req.body };
    } else {
      updateFields = { ...req.body };
    }

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
        });
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
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
// Test: Success
router.patch("/:id", authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "Missing eventId",
    });
  }

  if (!mongoose.isValidObjectId(eventId)) {
    return res.status(400).json({
      success: false,
      message: "Event id is not a valid ObjectId",
    });
  }

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event is not valid",
      });
    }

    const eventIndex = user.bookmarkedEvent.findIndex((id) => {
      return id.toString() === eventId;
    });

    if (eventIndex === -1) {
      event.totalBookmark += 1;
      user.bookmarkedEvent.push(eventId);
    } else {
      event.totalBookmark == 0 ? 0 : (event.totalBookmark -= 1);
      user.bookmarkedEvent.splice(eventIndex, 1);
    }

    await event.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User bookmark changed successfully",
      data: {
        bookmarkedEvent: user.bookmarkedEvent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

module.exports = router;
