var express = require("express");
const {
  postAdminLogin,
  getAdminLogin,
  adminDashbord,
  adminlogout,
  changePassword,
  postChangePassword,
  showallusers,
  forgotPassword,
  postForgotPassword,
  addProducts,
  postAddProducts,
  addCategory,
  postAddCategory,
  displayCategory,
  addsubCategory,
  postAddsubCategory,
  displaysubCategory,
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
router.post("/changepassword", postChangePassword);

router.get("/showallusers", showallusers);

router.get("/forgotpassword", forgotPassword);
router.post("/forgotpassword", postForgotPassword);

router.get("/addproducts", addProducts);
router.post("/addproducts", postAddProducts);

router.get("/category/add", addCategory);
router.post("/category/add", postAddCategory);
router.get("/category/display", displayCategory);

router.get("/subcategory/add", addsubCategory);
router.post("/subcategory/add", postAddsubCategory);
router.get("/subcategory/display", displaysubCategory);

module.exports = router;
