const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  mnumber: Number,
  gender: String,
});

module.exports = mongoose.model("userDatabases", tableSchema, "userDatabases");
