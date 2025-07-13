const express = require("express");
const router = express.Router();

// Models
const User = require("../models/User");

// Hashing & Token
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Utils
const dayjs = require("dayjs");
const transporter = require("../utils/mailer");
const createVerificationToken = require("../utils/createVerificationToken");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

// Route: /auth/register
// Method: POST
// Header: -
// Query: -
// Body: username, email, password
// Test: Success
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .notEmpty()
      .trim()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Minimum username length is 4 characters"),
  ],
  async (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
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
        username: username,
        email: email,
        password: hashedPassword,
      });

      const { rawToken, hashedToken, tokenExpires } = createVerificationToken();

      newUser.verifyToken = hashedToken;
      newUser.verifyTokenExpires = tokenExpires;

      await newUser.save();

      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

      await transporter.sendMail({
        from: '"Evently" <no-reply@evently.com>',
        to: email,
        subject: "Evently Account Confirmation",
        html: `
        <h2>Hello ${username},</h2>
        <p>Thank you for registering at Evently!</p>
        <p>Please click this link to verify your account:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will be expired in ${dayjs(tokenExpires).format(
          "HH:mm, DD MMM YYYY"
        )}</p>
        <p><i>If you feel like you're not registering to Evently, please ignore this email!.</i></p>
        `,
      });

      res.status(201).json({
        success: true,
        message:
          "User registration was successful. Check email for confirmation",
        data: {
          username,
          email,
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

// Route: /auth/resend-verification
// Method: POST
// Header: -
// Query: -
// Body: email
// Test: Success
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Missing required field",
    });
  }

  try {
    const user = await User.findOne({
      email,
      isVerified: false,
      verifyTokenExpires: {
        $lt: Date.now(),
      },
    });

    if (user) {
      const { rawToken, hashedToken, tokenExpires } = createVerificationToken();
      user.verifyToken = hashedToken;
      user.verifyTokenExpires = tokenExpires;
      await user.save();

      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

      await transporter.sendMail({
        from: '"Evently" <no-reply@evently.com>',
        to: email,
        subject: "Resend: Evently Account Confirmation",
        html: `
        <h2>Hello ${user.username},</h2>
        <p>Thank you for registering at Evently!</p>
        <p>Please click this link to verify your account:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will be expired in ${dayjs(tokenExpires).format(
          "HH:mm, DD MMM YYYY"
        )}</p>
        <p><i>If you feel like you're not registering to Evently, please ignore this email!.</i></p>
        `,
      });

      res.status(200).json({
        success: true,
        message: "Confirmation mail has been sent.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Email already verified or email not expired yet",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

// Route: /auth/verify-email
// Method: GET
// Header: -
// Query: token
// Body: -
// Test: Success
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
        message: "User not found/verification link changed",
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
      message: error?.message || "Internal server error",
    });
  }
});

// Route: /auth/login
// Method: GET
// Header: -
// Query: token
// Body: -
// Test: Success
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email/password mismatch",
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User not verified",
    });
  }

  if (user.authType !== "local") {
    return res.status(400).json({
      success: false,
      message: "User auth is not local",
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return res.status(400).json({
      success: false,
      message: "Email/password mismatch",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      authType: user.authType,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    success: true,
    message: "Login success",
    token,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      authType: user.authType,
      role: user.role,
    },
  });

  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

// Route: /auth/google
// Method: GET
// Header: -
// Query: -
// Body: -
// Test: Success
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route: /auth/google/callback
// Method: GET
// Header: -
// Query: -
// Body: -
// Test: Success
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    // dikirim dari done(null, token)
    const token = req.user;
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
