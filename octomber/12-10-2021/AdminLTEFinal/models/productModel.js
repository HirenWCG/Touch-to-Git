const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  product_name: String,
  product_detail: String,
  product_price: String,
  product_image: String,
  product_categorie: String,
  product_sub_categorie: String,
});

module.exports = mongoose.model("productModel", tableSchema);
