const mongoose = require("mongoose");

(() => {
  mongoose
    // .connect("mongodb://localhost:27017/demo", {
    //   useNewUrlParser: true,
    // })
    .connect("mongodb://test:test@localhost:27017/API", {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database Connected...");
    })
    .catch((err) => {
      console.log(err);
    });
})();
