const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  img: String,
});

module.exports = mongoose.model("adminPanel", tableSchema);
