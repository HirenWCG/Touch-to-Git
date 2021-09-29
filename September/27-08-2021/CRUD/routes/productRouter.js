var express = require("express");
const { addProduct } = require("../controller/productController");
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

module.exports = router;
