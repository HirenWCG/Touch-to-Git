var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function (req, res, next) {
  let fname = req.body.first_name;
  let email = req.body.email;
  res.render("output", { name: fname, mail: email });
});

module.exports = router;
