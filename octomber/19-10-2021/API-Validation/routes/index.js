var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
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
      .withMessage("Username should be atleast 5 characters..."),
    check("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .isLength({ min: 10 })
      .withMessage("Email should be atleast 10 characters long..."),
    check("number")
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
    const errors1 = validationResult(req).array();
    let errs = {};
    for (let err of errors1) {
      if (errs[err.param]) {
        errs[err.param].push(err.msg);
      } else {
        errs[err.param] = [];
        errs[err.param].push(err.msg);
      }
    }

    if (!!errs) {
      res.json(errs);
    } else {
      res.send("Registration Succesfully...");
    }

    // console.log(errs);
    // res.render("index", { errs });

    // let name = req.body.name;
    // let username = req.body.username;
    // let email = req.body.email;
    // let mobileNumber = req.body.number;
    // let gender = req.body.gender;

    // res.json({
    //   name,
    //   username,
    //   email,
    //   mobileNumber,
    //   gender,
    // });
  }
);

module.exports = router;
