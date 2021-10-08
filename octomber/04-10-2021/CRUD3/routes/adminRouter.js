var express = require("express");
const { adminArea, adminlogout } = require("../controller/adminarea");
var router = express.Router();
const adminModel = require("../models/admin");
const productModel = require("../models/productModel");

/* GET users listing. */
router.get("/", (req, res) => {
  res.render("admin/adminlogin");
});

router.post("/", adminArea);
router.get("/dashbord", (req, res) => {
  if (req.session.admin) {
    // res.redirect("/admin/dashbord");

    productModel
      .find()
      .lean()
      .then((data) => {
        // console.log(data);
        // let a = "Edit Item";
        res.render("admin/index", { layout: "layout", product: data });
      })
      .catch((err) => {});

    // console.log(req.session.admin);
  } else {
    res.redirect("/admin");
    // console.log("Hello");
  }
});

// router.get("/admindashbord", (req, res) => {
//   if (req.session.admin) {
//     res.render("admin/index");
//   } else {
//     res.redirect("/admin");
//   }
// });

router.get("/logout", adminlogout);

module.exports = router;
