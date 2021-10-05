const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const Table = require("../models/Table");
var jwt = require("jsonwebtoken");

// var get_cookies = function (request) {
//   var cookies = {};
//   request.headers &&
//     request.headers.cookie.split(";").forEach(function (cookie) {
//       var parts = cookie.match(/(.*?%)=(.*%)$/);
//       cookies[parts[1].trim()] = (parts[2] || "").trim();
//     });
//   return cookies;
// };

function cart(req, res, next) {
  if (req.session.user) {
    let id = req.params.id;
    productModel
      .findById(id)
      .then((data) => {
        if (data == null) {
          console.log("First data not found");
        } else {
          // let pname = data.product_name;
          // console.log(req.cookies);
          // let cookie = get_cookies(req);

          // console.log("Cookie : ", cookie.cart);
          // if (!!cookie && !!cookie.cart) {
          //   id = cookie.cart + "," + id;
          // }

          // if (!!cookies) {
          let p = 0;
          if (p < 4) {
            let tempProducts;
            if (req.cookies.products) {
              tempProducts = req.cookies.products;
              tempProducts.push(id);
              res.cookie("products", tempProducts);
            } else {
              res.cookie("products", [id]);
            }
            p++;
          }
          console.log(req.cookies.products);
          // }

          // console.log(req.cookies["cart"]);

          // res.cookie("cart", id);

          // console.log("Cookie : ", cookie.cart);

          Table.findById(req.session.user)
            .then((user) => {
              let a = user.id;
              cartModel.find({ user_id: a }).then((cart) => {
                if (cart == 0) {
                  let item = {
                    user_id: user._id,
                    products: [
                      {
                        productId: data._id,
                        name: data.product_name,
                        price: data.product_price,
                      },
                    ],
                  };
                  let tempData = cartModel(item);
                  tempData.save((err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("/dashbord");
                    }
                  });
                } else {
                  cart[0].products.push({
                    productId: data._id,
                    name: data.product_name,
                    price: data.product_price,
                  });
                  cart[0]
                    .save()
                    .then(() => {
                      res.redirect("/dashbord");
                    })
                    .catch();
                }
              });
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
}

function deleteCartItem(req, res) {
  if (req.session.user) {
    cartModel
      .findOneAndUpdate(
        { user_id: req.session.user },
        { $pull: { products: { _id: req.params.id } } }
      )
      .then((a) => {
        res.redirect("/dashbord");
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/login");
  }
}

function emptycart(req, res) {
  if (req.session.user) {
    let deleteid = req.params.id;
    cartModel.findByIdAndDelete(deleteid, function (err, data) {
      if (err) {
        throw err;
      } else {
        res.redirect("/dashbord");
      }
    });
  } else {
    res.redirect("/login");
  }
}

function payment(req, res) {
  // console.log(req.session.userid);
  if (req.session.user) {
    // let recentProductsIds = req.cookies.products

    Table.findById(req.session.user)
      .then((data) => {
        productModel
          .find()
          .then((products) => {
            let a = data.id;
            cartModel
              .findOne({ user_id: a })
              .then((cart) => {
                let recentProductsIds = req.cookies.products;

                productModel
                  .find({ _id: { $in: recentProductsIds } })
                  .then((recentProduct) => {
                    if (!!cart) {
                      let totalPrice = 0;
                      for (let product of cart.products) {
                        totalPrice += parseInt(product.price);
                      }
                      let hasRecentProducts = recentProduct.length
                        ? true
                        : false;
                      let z = cart.id;
                      let a = cart.products;
                      res.render("dashbord", {
                        user: data,
                        products: products,
                        cart: a,
                        cartObjectId: z,
                        total: totalPrice,
                        recentProduct,
                        hasRecentProducts,
                      });
                    } else {
                      let hasRecentProducts = recentProduct.length
                        ? true
                        : false;
                      res.render("dashbord", {
                        user: data,
                        products: products,
                        recentProduct,
                        total: totalPrice,
                        hasRecentProducts,
                      });
                    }
                    // console.log("recent" + recentProduct.length);
                  })
                  .catch((err) => {
                    next(err);
                  });
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
  res.render("payment/payment");
}

module.exports = {
  cart,
  deleteCartItem,
  emptycart,
  payment,
};
