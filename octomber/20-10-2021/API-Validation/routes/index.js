const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const userModel = require("../models/userModel");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("This is Index Page...");
});

router.post(
  "/",
  [
    check("name")
      .isAlpha()
      .withMessage("name can not contain numbers...")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters..."),
    check("username")
      .isLength({ min: 5 })
      .trim()
      .withMessage("Username should be atleast 5 characters..."),
    check("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .isLength({ min: 10 })
      .withMessage("Email should be atleast 10 characters long..."),
    check("mobileNumber")
      .not()
      .isEmpty()
      .withMessage("Phone number is necessary...")
      .isMobilePhone()
      .isLength({ min: 10, max: 10 })
      .withMessage("Not a valid phone number..."),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is necessary...")
      .isLength({ min: 5 })
      .withMessage("Should be 5 characters long..."),
  ],
  function (req, res, next) {
    const errors = validationResult(req).array();
    if (errors.length) {
      res.send(errors);
    } else {
      var item = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mnumber: req.body.mobileNumber,
        gender: req.body.gender,
      };
      userModel
        .findOne({ email: req.body.email })
        .then((data) => {
          if (data) {
            res.send("Email Already used...");
          } else {
            var allData = userModel(item);
            allData.save((err, result) => {
              if (err) {
                throw err;
              } else {
                res.send("user successfully registred...");
              }
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    let data = await userModel.findOne({ email: req.body.email });
    if (data) {
      if (data.password == req.body.password) {
        res.send("You are successfully Login...");
      } else {
        res.send("Your Password is Wrong!");
      }
    } else {
      res.send("Email Invalid... please SignUp First...");
    }
  } catch (error) {
    res.send("Unable to process your request");
  }
});

module.exports = router;
