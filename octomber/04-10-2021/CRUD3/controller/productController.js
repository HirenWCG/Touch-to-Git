const productModel = require("../models/productModel");
const Table = require("../models/Table");
const cartModel = require("../models/cartModel");

function addProduct(req, res) {
  if (req.session.admin) {
    // console.log(req.files.pimg);
    var item = {
      product_name: req.body.pname,
      product_detail: req.body.pdetails,
      product_price: req.body.productprice,
      product_image: req.files.pimg.name,
      product_categorie: req.body.categorie_name,
    };

    let img = req.files.pimg;

    let tempData = productModel(item);

    img.mv(`public/productsImages/${req.files.pimg.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        tempData.save((err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/admin/dashbord");
          }
        });
      }
    });
  } else {
    res.redirect("/admin");
  }
}

function editProduct(req, res) {
  var item = {
    product_name: req.body.pname,
    product_detail: req.body.pdetails,
    product_price: req.body.productprice,
    product_image: req.files.pimg.name,
    product_categorie: req.body.categorie_name,
  };
  let id = req.params.id;
  productModel
    .findByIdAndUpdate(id, item)
    .then(() => {
      res.redirect("/admin/dashbord");
    })
    .catch(() => {
      console.log("err");
    });
}

function desktop(req, res) {
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        productModel
          .find({ product_categorie: "desktop" })
          .then((products) => {
            let a = data.id;
            cartModel
              .find({ user_id: a })
              .then((cart) => {
                if (cart == 0) {
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                  });
                } else {
                  let z = cart[0].id;
                  let a = cart[0].products;
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                    cartObjectId: z,
                  });
                }
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
}

function laptop(req, res) {
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        productModel
          .find({ product_categorie: "laptop" })
          .then((products) => {
            let a = data.id;
            cartModel
              .find({ user_id: a })
              .then((cart) => {
                if (cart == 0) {
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                  });
                } else {
                  let z = cart[0].id;
                  let a = cart[0].products;
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                    cartObjectId: z,
                  });
                }
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
}

function mobile(req, res) {
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        productModel
          .find({ product_categorie: "mobile" })
          .then((products) => {
            let a = data.id;
            cartModel
              .find({ user_id: a })
              .then((cart) => {
                if (cart == 0) {
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                  });
                } else {
                  let z = cart[0].id;
                  let a = cart[0].products;
                  res.render("dashbord", {
                    user: data,
                    products: products,
                    cart: a,
                    cartObjectId: z,
                  });
                }
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  addProduct,
  editProduct,
  desktop,
  laptop,
  mobile,
};
