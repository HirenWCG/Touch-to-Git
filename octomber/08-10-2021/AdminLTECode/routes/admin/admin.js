var express = require("express");
const {
  postAdminLogin,
  getAdminLogin,
  adminDashbord,
  adminlogout,
  changePassword,
} = require("../../controllers/adminLoginController");
var router = express.Router();

/* GET home page. */
// router.get("/dashboard", function (req, res, next) {
//   res.render("adminDashboard", {
//     title: "Dashboard",
//   });
// });
router.get("/dashboard", adminDashbord);

router.get("/login", getAdminLogin);
router.post("/login", postAdminLogin);

router.get("/logout", adminlogout);

router.get("/changepassword", changePassword);

router.get("/forgotpassword", function (req, res, next) {
  res.render("adminForgotPassword", { layout: "secondMain.handlebars" });
});

module.exports = router;
