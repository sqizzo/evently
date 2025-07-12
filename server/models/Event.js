const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate;
        },
        message: "End date must be greater than the start date",
      },
    },
    location: String,
    bannerUrl: String,
    ticketPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    category: {
      type: String,
      enum: [
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
      ],
      required: true,
      default: "others",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
