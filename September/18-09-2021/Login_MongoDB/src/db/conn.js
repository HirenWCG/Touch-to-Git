const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/crud")
  .then((result) => {
    console.log("MongoDB Connection Successfully..");
  })
  .catch((err) => {
    console.log(err);
  });
