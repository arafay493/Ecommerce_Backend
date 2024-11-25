const mongoose = require("mongoose");

// Connect MongoDB at default port 27017.
const db = () => {
  mongoose
    .connect("mongodb://localhost:27017/digitic")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB");
    });
};

module.exports = db;
