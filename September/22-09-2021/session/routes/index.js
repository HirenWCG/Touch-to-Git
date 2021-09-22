var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/color", function (req, res, next) {
  res.render("color", { title: "Express" });
});

router.post("/", function (req, res, next) {
  let color = req.body.pickcolor;
  res.cookie("Color", color);
  var cookie = req.headers.cookie;
  console.log(cookie);
  res.render("index", { color: color });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.post("/login", function (req, res, next) {
  let fname = req.body.first_name;
  let email = req.body.email;
  req.session.username = fname;
  res.cookie("username", fname);
  res.cookie("email", email, { maxAge: 10000 });
  res.redirect("/dashbord");
});

router.get("/dashbord", function (req, res, next) {
  if (req.session.username) {
    let name = req.session.username;
    res.render("dashbord", { name: name });
  } else {
    res.redirect("/");
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

router.get("/counter", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});

router.get("/cookie", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;

  // Write response
  res.cookie("counter", req.session.views);
  res.end(req.session.views + " views");
});
module.exports = router;
