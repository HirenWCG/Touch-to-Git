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
    check("pancard")
      .matches(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)
      .withMessage("Please Enter Valid PanCard Number"),
    check("gst")
      .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)
      .withMessage("Please Enter Valid GST Number"),
    check("aadhar")
      .matches(/^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/)
      .withMessage("Please Enter Valid Aadhar Number"),
    check("passport")
      .matches(/^[A-Z][0-9]{8}$/)
      .withMessage("Please Enter Valid Passport Number"),
    check("mobilenumber")
      .matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
      .withMessage("Please Enter Valid Mobile Number"),
    check("password")
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
      .withMessage("Please Enter Valid Password"),
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
