var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
require("../src/db/conn");
const Schema = mongoose.Schema;
const studenSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  pass: String,
  mnumber: Number,
  active: Boolean,
});
const Student = mongoose.model("student", studenSchema);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function (req, res, next) {
  let fname = req.body.first_name;
  let lname = req.body.last_name;
  let email = req.body.email;
  let pass = req.body.password;
  let mnumber = req.body.mnumber;

  async function saveData() {
    const students = new Student({
      fname: fname,
      lname: lname,
      email: email,
      pass: pass,
      mnumber: mnumber,
      active: true,
    });

    const result = await students.save();
    res.render("output");
    console.log({ students: result });
  }
  saveData();
});

module.exports = router;
