const exress = require("express");
const router = exress.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("sign-in");
});

module.exports = router;
