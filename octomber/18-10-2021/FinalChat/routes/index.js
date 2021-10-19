var express = require("express");
var router = express.Router();
var chatModel = require("../models/chatModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/room", function (req, res, next) {
  res.render("chat");
});
module.exports = router;
