var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/results", function (req, res, next) {
  let m1 = parseInt(req.body.m1);
  let m2 = parseInt(req.body.m2);
  let m3 = parseInt(req.body.m3);
  let m4 = parseInt(req.body.m4);
  let m5 = parseInt(req.body.m5);
  let total = m1 + m2 + m3 + m4 + m5;
  if (m1 <= 100 && m2 <= 100 && m3 <= 100 && m4 <= 100 && m5 <= 100) {
    let avg = total / 5;
    if (avg >= 80) {
      res.render("result", {
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        a: "A",
        t: total,
        e: "congratulations! you have passed this exam!",
      });
    } else if (avg >= 60 && avg < 80) {
      res.render("result", {
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        a: "B",
        t: total,
        e: "congratulations! you have passed this exam!",
      });
    } else if (avg >= 40 && avg < 60) {
      res.render("result", {
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        a: "C",
        t: total,
        e: "congratulations! you have passed this exam!",
      });
    } else if (avg >= 33 && avg < 40) {
      res.render("result", {
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        a: "D",
        t: total,
        e: "congratulations! you have passed this exam!",
      });
    } else {
      res.render("result", {
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        a: "E",
        t: total,
        ee: "Sorry! you have not cleared this exam!",
      });
    }
  } else {
    res.json({ Message: "Please Enter Less Then 100 Value" });
  }
});

module.exports = router;
