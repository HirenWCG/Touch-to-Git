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
  role: String,
});

module.exports = mongoose.model("userDatabase", tableSchema, "userDatabases");
