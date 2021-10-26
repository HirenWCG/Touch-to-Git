const categoryModel = require("../models/categoryModel");
const subCategory = require("../models/subCategoryModel");

function getSubcategoryById(req, res) {
  subCategory
    .find({ _category: req.params.id })
    .then((data) => {
      res.send({
        type: "success",
        data: data,
      });
    })
    .catch((err) => {
      res.send({
        type: "error",
        messsage: err.message,
      });
    });
}

function subEditCategory(req, res) {
  if (req.session.admin) {
    res.render("admin/subcategory/editSubCategory");
  } else {
    res.redirect("/admin/login");
  }
}

function postSubEditCategory(req, res) {
  if (req.session.admin) {
    let a = req.params.id;
    let b = req.body.editCategory;
    subCategory
      .findByIdAndUpdate(a, { subCategoryName: b })
      .then((data) => {
        console.log(data);
        res.redirect("/admin/subcategory/display");
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function addsubCategory(req, res) {
  if (req.session.admin) {
    categoryModel
      .find()
      .lean()
      .then((data) => {
        res.render("admin/subcategory/addSubCategory", { data });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function postAddsubCategory(req, res) {
  if (req.session.admin) {
    const mybodydata = {
      subCategoryName: req.body.subCategory,
      _category: req.body._category,
    };
    var data = subCategory(mybodydata);
    data
      .save()
      .then((data) => {
        res.redirect("/admin/subcategory/display");
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function displaysubCategory(req, res) {
  if (req.session.admin) {
    subCategory
      .find()
      .populate("_category")
      .lean()
      .then((data) => {
        // console.log(data);
        res.render("admin/subcategory/displaySubCategory", { data });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}
module.exports = {
  getSubcategoryById,
  subEditCategory,
  postSubEditCategory,
  addsubCategory,
  postAddsubCategory,
  displaysubCategory,
};
