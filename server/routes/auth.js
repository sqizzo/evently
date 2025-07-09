const express = require("express");
const router = express.Router();

// Models
const User = require("../models/User");

// Hashing & Token
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Utils
const transporter = require("../utils/mailer");

// Route: /register
// Method: POST
// Header: -
// Query: -
// Body: username, email, password
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required body",
    });
  }

  try {
    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Dikirim ke user lewat email
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Simpan
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    newUser.verifyToken = hashedToken;

    // Expires dalam 7 jam
    // in ms = sekarang + 7 jam * 60 menit * 60 detik * 1000 ms
    const tokenExpires = Date.now() + 7 * 60 * 60 * 1000;
    newUser.verifyTokenExpires = tokenExpires;

    await newUser.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/token=${rawToken}`;

    transporter.sendMail({
      from: '"Evently" <no-reply@evently.com>',
      to: email,
      subject: "Evently Account Confirmation",
      html: `
        <h2>Hello ${username},</h2>
        <p>Thank you for registering at Evently!</p>
        <p>Please click this link to verify your account:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will be expired in ${tokenExpires}</p>
        <p><i>If you feel like you're not registering to Evently, please ignore this email!.</i></p>
        `,
    });

    res.status(201).json({
      success: true,
      message: "User registration was successful. Check email for confirmation",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
});

// Route: /verify-email
// Method: GET
// Header: -
// Query: token
// Body: -
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Missing token on request parameter",
    });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Check if user exists in the DB
    const user = await User.findOne({
      verifyToken: hashedToken,
      isVerified: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Token expired
    if (Date.now() > user.verifyTokenExpires) {
      return res.status(400).json({
        success: false,
        message:
          "Verification mail was expired. Please resend the verification mail",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpires = null;

    await user.save();

    res.status(201).json({
      success: true,
      message: "User verification was successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
});

module.exports = router;
