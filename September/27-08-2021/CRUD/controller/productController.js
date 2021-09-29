const productModel = require("../models/productModel");

function addProduct(req, res) {
  if (req.session.admin) {
    console.log(req.files.pimg);
    var item = {
      product_name: req.body.pname,
      product_detail: req.body.pdetails,
      product_price: req.body.productprice,
      product_image: req.files.pimg.name,
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

module.exports = {
  addProduct,
};
