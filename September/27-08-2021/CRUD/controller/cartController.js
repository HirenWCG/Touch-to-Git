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
          console.log("First data not found");
        } else {
          Table.findById(req.session.user)
            .then((user) => {
              // console.log("userdata" + user.id);
              let a = user.id;
              cartModel.find({ "user.user_id": a }).then((cart) => {
                if (cart == 0) {
                  let item = {
                    user: {
                      user_id: user._id,
                      username: user.username,
                    },
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
                      // console.log("Second data not found");
                      console.log(err);
                    } else {
                      res.redirect("/dashbord");
                    }
                  });
                } else {
                  // console.log(cart[0]);
                  // console.log("dfgggfggfggfggfgf" + cart[0].products);
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
module.exports = {
  cart,
};
