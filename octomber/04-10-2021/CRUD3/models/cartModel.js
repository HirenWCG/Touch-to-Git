const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  user_id: String,
  products: [
    {
      productId: String,
      name: String,
      price: Number,
    },
  ],
});

module.exports = mongoose.model("cartModel", tableSchema);
