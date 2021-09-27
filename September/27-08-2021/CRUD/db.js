const mongoose = require("mongoose");

function connectDb() {
  mongoose
    .connect("mongodb://localhost:27017/demo")
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectDb;
