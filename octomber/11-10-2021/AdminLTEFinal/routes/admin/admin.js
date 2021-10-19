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
} = require("../../controllers/adminDashboardController");

const {
  addCategory,
  postAddCategory,
  displayCategory,
  editCategory,
  postEditCategory,
} = require("../../controllers/categoryController");
var router = express.Router();

const {
  addProducts,
  postAddProducts,
  displayAllProducts,
  editProducts,
  postEditProducts,
} = require("../../controllers/productController");
var router = express.Router();

const {
  getSubcategoryById,
  subEditCategory,
  postSubEditCategory,
  addsubCategory,
  postAddsubCategory,
  displaysubCategory,
} = require("../../controllers/subCategoryController");
var router = express.Router();

router.get("/dashboard", adminDashbord);

router.get("/login", getAdminLogin);
router.post("/login", postAdminLogin);

router.get("/logout", adminlogout);

router.get("/changepassword", changePassword);
router.post("/changepassword", postChangePassword);

router.get("/showallusers", showallusers);

router.get("/forgotpassword", forgotPassword);
router.post("/forgotpassword", postForgotPassword);

router.get("/product/add", addProducts);
router.post("/product/add", postAddProducts);
router.get("/product/display", displayAllProducts);
router.get("/product/edit/:id", editProducts);
router.post("/product/edit/:id", postEditProducts);

router.get("/category/edit/:id", editCategory);
router.post("/category/edit/:id", postEditCategory);
router.get("/category/add", addCategory);
router.post("/category/add", postAddCategory);
router.get("/category/display", displayCategory);

router.get("/subcategories/:id", getSubcategoryById);
router.get("/subcategory/edit/:id", subEditCategory);
router.post("/subcategory/edit/:id", postSubEditCategory);
router.get("/subcategory/add", addsubCategory);
router.post("/subcategory/add", postAddsubCategory);
router.get("/subcategory/display", displaysubCategory);

module.exports = router;
