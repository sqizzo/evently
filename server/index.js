require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");

// Config
require("./configs/passport");
const PORT = process.env.PORT || 5000;

// Buat instance server express
const app = express();

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const eventRouter = require("./routes/event");
const multerErrorHandler = require("./middlewares/multerErrorHandler");

// Pakai cors biar frontend bisa akses backend
// credentials: true untuk izinin browser kirim credentials seperti cookie, auth bearer
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan("tiny"));

// Biar bisa baca request body berupa JSON dari FE (req.body)
app.use(express.json());

// Biar bisa baca cookie dan menyimpannya di req.cookies
app.use(cookieParser());

// Passport initialize
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Evently API ready!");
});

app.use("/auth", authRouter);
app.use("/me", profileRouter);
app.use("/events", eventRouter);
app.use(multerErrorHandler);

// Catch error kalau udah mumet banget
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("---- Server Started ----");
    console.log("Connection to MongoDB was successfully established");
    app.listen(PORT, () => {
      console.log(
        `Server running on: http://${process.env.HOSTNAME}:${process.env.PORT}
Client running on: http://${process.env.CLIENT_URL}`
      );
      console.log("---- Logger ----");
    });
  })
  .catch((err) =>
    console.log("Connection to MongoDB was unsuccessful with error: ", err)
  );
