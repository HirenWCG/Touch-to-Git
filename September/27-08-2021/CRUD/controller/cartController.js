const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const Table = require("../models/Table");

function cart(req, res, next) {
  if (req.session.user) {
    let id = req.params.id;
    productModel
      .findById(id)
      .then((data) => {
        if (data == null) {
          console.log("data not found");
        } else {
          Table.findById(req.session.user)
            .then((user) => {
              let user3 = user.id;
              let user2 = user.username;
              console.log("Hello im z" + z);
              cartModel(user);
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });
    res.send("ok");
  } else {
    res.redirect("/login");
  }
}
module.exports = {
  cart,
};
