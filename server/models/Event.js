const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    //default new
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    //default undef
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate;
        },
        message: "End date must be greater than the start date",
      },
    },
    location: {
      type: String,
      required: true,
    },
    //default undef
    bannerUrl: String,
    ticketPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    //default others
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
    totalBookmark: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.virtual("status").get(function () {
  const now = new Date();

  if (now < this.startDate) {
    return "upcoming";
  } else {
    if (now > this.endDate) {
      return "ended";
    } else {
      return "ongoing";
    }
  }
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
