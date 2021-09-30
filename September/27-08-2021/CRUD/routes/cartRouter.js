var express = require("express");
const { cart } = require("../controller/cartController");
const productModel = require("../models/cartModel");
var router = express.Router();

router.get("/:id", cart);

module.exports = router;
