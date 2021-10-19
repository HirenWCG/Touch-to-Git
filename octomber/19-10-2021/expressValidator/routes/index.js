var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post(
  "/",
  [
    check("name")
      .isAlpha()
      .withMessage("name can not contain numbers")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters"),
    check("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .isLength({ min: 10 })
      .withMessage("Email should be atleast 10 characters long"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is necessary")
      .isLength({ min: 5 })
      .withMessage("Should be 5 characters long"),
    check("number")
      .not()
      .isEmpty()
      .withMessage("Phone number is necessary")
      .isMobilePhone()
      .isLength({ min: 10, max: 10 })
      .withMessage("Not a valid phone number my friend..."),
  ],
  function (req, res) {
    const errors1 = validationResult(req).array();
    // let success = errors1.length > 0 ? false : true;
    // console.log(errors1);

    let errs = {};
    for (let err of errors1) {
      if (err) {
        errs[err.param] = [];
        errs[err.param].push(err.msg);
      }
    }
    // console.log(errs);

    res.render("index", { errs });
  }
);
module.exports = router;
