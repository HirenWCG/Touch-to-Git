const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

function addProducts(req, res) {
  if (req.session.admin) {
    categoryModel
      .find()
      .lean()
      .then((categoryData) => {
        console.log(categoryData);
        res.render("admin/adminDashboard/adminAddProducts", { categoryData });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function postAddProducts(req, res) {
  if (req.session.admin) {
    // console.log(req.files.pimg);
    var item = {
      product_name: req.body.productName,
      product_detail: req.body.productDescription,
      product_price: req.body.productPrice,
      product_image: req.files.productImage.name,
      product_categorie: req.body.category,
      product_sub_categorie: req.body.subCategory,
    };

    let img = req.files.productImage;

    let tempData = productModel(item);

    img.mv(`public/productsImages/${req.files.productImage.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        tempData.save((err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/admin/product/display");
          }
        });
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

function displayAllProducts(req, res) {
  if (req.session.admin) {
    productModel.countDocuments;
    productModel
      .find()
      .lean()
      .then((data) => {
        res.render("admin/products/displayProducts", { data });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function editProducts(req, res) {
  if (req.session.admin) {
    categoryModel
      .find()
      .lean()
      .then((categoryData) => {
        console.log(categoryData);
        res.render("admin/adminDashboard/adminAddProducts", { categoryData });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function postEditProducts(req, res) {
  if (req.session.admin) {
    // console.log(req.files.pimg);
    var item = {
      product_name: req.body.productName,
      product_detail: req.body.productDescription,
      product_price: req.body.productPrice,
      product_image: req.files.productImage.name,
      product_categorie: req.body.category,
      product_sub_categorie: req.body.subCategory,
    };

    let img = req.files.productImage;

    let tempData = productModel(item);

    img.mv(`public/productsImages/${req.files.productImage.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        tempData.save((err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/admin/product/display");
          }
        });
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

module.exports = {
  addProducts,
  postAddProducts,
  displayAllProducts,
  editProducts,
  postEditProducts,
};
