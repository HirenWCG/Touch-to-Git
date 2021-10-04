const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  username: String,
  email: String,
  dob: String,
  password: String,
  mnumber: Number,
  gender: String,
  address: String,
  img: String,
});

module.exports = mongoose.model("Table", tableSchema);
