var express = require("express");
const { cart, deleteCartItem } = require("../controller/cartController");
const productModel = require("../models/cartModel");
var router = express.Router();

router.get("/:id", cart);
router.get("/delete/:id", deleteCartItem);
module.exports = router;
