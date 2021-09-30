var express = require("express");
const { addProduct, editProduct } = require("../controller/productController");
const productModel = require("../models/productModel");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  if (req.session.admin) {
    res.render("product/product");
    // res.send("Hi");
  } else {
    res.redirect("/admin");
  }
});

router.post("/", addProduct);

router.get("/editproduct/:id", (req, res) => {
  if (req.session.admin) {
    res.render("product/editproduct");
  } else {
    res.redirect("/admin");
  }
});

router.post("/editproduct/:id", editProduct);

router.get("/deletehi/:id", (req, res) => {
  if (req.session.admin) {
    let deleteid = req.params.id;
    productModel.findByIdAndDelete(deleteid, function (err, data) {
      if (err) {
        throw err;
      } else {
        res.redirect("/admin/dashbord");
      }
    });
  } else {
    res.redirect("/admin");
  }
});
module.exports = router;
