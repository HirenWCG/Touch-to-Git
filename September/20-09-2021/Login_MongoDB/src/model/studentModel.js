const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const studenSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  pass: String,
  mnumber: Number,
  active: Boolean,
});
module.exports = mongoose.model("student", studenSchema);
