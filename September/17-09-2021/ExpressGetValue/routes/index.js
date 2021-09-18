var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", (req, res) => {
  let value1 = parseInt(req.body.value1);
  let value2 = parseInt(req.body.value2);
  let sum = value1 + value2;
  res.render("output", { v1: value1, v2: value2, s: sum });
});

module.exports = router;
