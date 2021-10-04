const mongoose = require("mongoose");

function connectDb() {
  mongoose
    .connect("mongodb://demo:demo@localhost:27017/demo")
    .then(() => {
      console.log("Database Connected...");
    })
    .catch((err) => {
      console.log("Database Not Connected...");
    });
}

module.exports = connectDb;
