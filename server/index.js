require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Config
const PORT = process.env.PORT || 5000;

// Buat instance server express
const app = express();

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

app.get("/", (req, res) => {
  res.send("Evently API ready!");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("---- Server Started ----");
    console.log("Connection to MongoDB was successfully established");
    app.listen(PORT, () => {
      console.log(
        `Server running on: http://${process.env.HOSTNAME}:${process.env.PORT}`
      );
      console.log("---- Logger ----");
    });
  })
  .catch((err) =>
    console.log("Connection to MongoDB was unsuccessful with error: ", err)
  );
