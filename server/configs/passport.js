const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        let user;

        if (existingUser) {
          user = existingUser;
        } else {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,
            authType: "google",
          });
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            authType: user.authType,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, token);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
