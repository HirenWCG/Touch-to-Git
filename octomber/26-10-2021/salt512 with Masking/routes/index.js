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

router.get("/a", (req, res) => {
  let obj = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  let value = "4404447773366005554446220277774449992";
  let newValue = value.split("");
  let storeNumber;
  let firstZero;
  let counter = 0;
  let result = [];
  for (let data of newValue) {
    if (storeNumber == undefined) {
      storeNumber = data;
      counter++;
      if (firstZero == data) {
        result.push(" ");
        firstZero = undefined;
        storeNumber = undefined;
        counter = 0;
      }
    } else {
      if (storeNumber == data) {
        counter++;
      } else {
        let z = obj[storeNumber].split("");
        result.push(z[counter - 1]);
        storeNumber = undefined;
        counter = 0;
        storeNumber = data;
        counter++;
        if (storeNumber == 0) {
          firstZero = data;
          storeNumber = undefined;
          counter = 0;
        }
      }
    }
  }
  let z = obj[storeNumber].split("");
  result.push(z[counter - 1]);
  storeNumber = undefined;
  counter = 0;
  console.log(result.join(""));
});

router.get("/test", (req, res) => {
  shortUrl.short(
    "https://stackoverflow.com/questions/25153474/split-a-string-and-store-value-in-array-in-javascript",
    function (err, url) {
      console.log(url);
    }
  );
});

module.exports = router;
