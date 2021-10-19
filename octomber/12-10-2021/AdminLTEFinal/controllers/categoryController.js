const categoryModel = require("../models/categoryModel");
function editCategory(req, res) {
  if (req.session.admin) {
    res.render("admin/category/editCategory");
  } else {
    res.redirect("/admin/login");
  }
}
function postEditCategory(req, res) {
  if (req.session.admin) {
    let a = req.params.id;
    let b = req.body.editCategory;
    categoryModel
      .findByIdAndUpdate(a, { categoryName: b })
      .then((data) => {
        console.log(data);
        res.redirect("/admin/category/display");
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}
function addCategory(req, res) {
  if (req.session.admin) {
    res.render("admin/category/addCategory");
  } else {
    res.redirect("/admin/login");
  }
}
function postAddCategory(req, res) {
  const mybodydata = {
    categoryName: req.body.category,
  };
  var data = categoryModel(mybodydata);

  data
    .save()
    .then((data) => {
      res.redirect("/admin/category/add");
    })
    .catch((err) => {
      throw err;
    });
}
function displayCategory(req, res) {
  if (req.session.admin) {
    categoryModel
      .find()
      .lean()
      .then((data) => {
        res.render("admin/category/displayCategory", { data });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}
function addCategory(req, res) {
  if (req.session.admin) {
    res.render("admin/category/addCategory");
  } else {
    res.redirect("/admin/login");
  }
}
module.exports = {
  addCategory,
  postAddCategory,
  displayCategory,
  editCategory,
  postEditCategory,
};
