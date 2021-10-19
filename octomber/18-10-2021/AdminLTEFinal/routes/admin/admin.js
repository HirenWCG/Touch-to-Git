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

const {
  addStates,
  postAddStates,
  displayStates,
  editStates,
  postEditStates,
  deleteStates,
} = require("../../controllers/stateController");

const {
  addCity,
  postAddCity,
  displayCity,
  editCity,
  postEditCity,
  deleteCity,
} = require("../../controllers/cityController");

const {
  addArea,
  postAddArea,
  displayArea,
  editArea,
  postEditArea,
  deleteArea,
} = require("../../controllers/areaController");

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
router.get("/product/edit", editProducts);
router.post("/product/edit", postEditProducts);

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

router.get("/states/add", addStates);
router.post("/states/add", postAddStates);
router.get("/states/display", displayStates);
router.get("/states/edit/:id", editStates);
router.post("/states/edit/:id", postEditStates);
router.get("/states/delete/:id", deleteStates);

router.get("/city/add", addCity);
router.post("/city/add", postAddCity);
router.get("/city/display", displayCity);
router.get("/city/edit/:id", editCity);
router.post("/city/edit/:id", postEditCity);
router.get("/city/delete/:id", deleteCity);

router.get("/area/add", addArea);
router.post("/area/add", postAddArea);
router.get("/area/display", displayArea);
router.get("/area/edit/:id", editArea);
router.post("/area/edit/:id", postEditArea);
router.get("/area/delete/:id", deleteArea);
module.exports = router;
