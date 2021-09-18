var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function (req, res, next) {
  let username = "hiren";
  let password = "hiren123";
  let a = req.body.username;
  let b = req.body.password;
  if (a == username && b == password) {
    res.render("output");
  } else {
    res.json({ message: "please enter correct login details" });
  }
});

module.exports = router;
