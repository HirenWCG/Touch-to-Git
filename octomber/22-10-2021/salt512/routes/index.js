var express = require("express");
var router = express.Router();
const {
  userRegistration,
  postUserRegistration,
  userLogin,
  postUserLogin,
} = require("../controllers/userControllers");

/* GET home page. */
router.get("/", userRegistration);
router.post("/", postUserRegistration);

router.get("/login", userLogin);
router.post("/login", postUserLogin);

module.exports = router;
