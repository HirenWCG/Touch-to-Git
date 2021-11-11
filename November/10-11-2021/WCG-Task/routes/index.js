var express = require("express");
var shortUrl = require("node-url-shortener");
var router = express.Router();
const {
  userRegistration,
  postUserRegistration,
  userLogin,
  checkEmail,
  // postUserLogin,
} = require("../controllers/userControllers");
const passport = require("passport");

/* GET home page. */
router.get("/", userRegistration);
router.post("/", postUserRegistration);
router.post("/submitData", (req, res) => {
  console.log(req.body);
});

router.get("/login", userLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/dashboard", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }
  res.render("dashboard");
});

router.get("/logout", (req, res) => {
  let userid = req.user._id;
  console.log(userid);
  req.logout();
  res.redirect("/login");
});

router.get("/emailcheckvalidation", checkEmail);
module.exports = router;
