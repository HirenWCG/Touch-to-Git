var express = require("express");
const {
  cart,
  deleteCartItem,
  emptycart,
  payment,
} = require("../controller/cartController");
const productModel = require("../models/cartModel");
var router = express.Router();

router.get("/emptycart/:id", emptycart);
router.get("/payment", payment);
router.get("/:id", cart);
router.get("/delete/:id", deleteCartItem);

module.exports = router;
