const express = require("express");
const router = express.Router();

// Models
const User = require("../models/User");

// Middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Utils
const transporter = require("../utils/mailer");
const createVerificationToken = require("../utils/createVerificationToken");
const dayjs = require("dayjs");
const { body, validationResult } = require("express-validator");

// Route: /me
// Method: GET
// Header: Authorization token
// Query: -
// Body: -
// Test: Success
router.get("/", authMiddleware, async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findOne(
      { _id: id },
      { password: 0, verifyToken: 0, verifyTokenExpires: 0 }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
});

// Route: /me/edit
// Method: POST
// Header: Authorization token
// Query: -
// Body: email, username
// Test:
router.post(
  "/edit",
  [
    body("email").trim().isEmail().withMessage("Email must be valid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 4 })
      .withMessage("Minimum username length is 4 characters"),
  ],
  authMiddleware,
  async (req, res) => {
    const { username, email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    try {
      const id = req.user.id;

      const user = await User.findOne({ _id: id }, { password: 0 });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.email !== email) {
        const { hashedToken, rawToken, tokenExpires } =
          createVerificationToken();
        user.email = email.trim();
        user.isVerified = false;

        // Pake utils
        user.verifyToken = hashedToken;
        user.verifyTokenExpires = tokenExpires;

        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;
        await transporter.sendMail({
          from: '"Evently" <no-reply@evently.com>',
          to: email,
          subject: "Evently Email Changed",
          html: `
        <h2>Hello ${username},</h2>
        <p>Looks like you've changed your email!</p>
        <p>Please click this link to verify your account again:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will be expired in ${dayjs(tokenExpires).format(
          "HH:mm, DD MMM YYYY"
        )}</p>
        <p><i>If you feel like you're not registering to Evently, please ignore this email!.</i></p>
        `,
        });
      }

      user.username = username.trim();

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.verifyToken;
      delete userObj.verifyTokenExpires;

      res.status(200).json({
        success: true,
        message: "Profile updated",
        data: userObj,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error || "Internal server error",
      });
    }
  }
);

module.exports = router;
