const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  img: String,
  auth: Number,
});

module.exports = mongoose.model("adminData", tableSchema);
