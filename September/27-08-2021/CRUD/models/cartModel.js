const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  user: {
    user_id: String,
    username: String,
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
    },
  ],
});

module.exports = mongoose.model("cartModel", tableSchema);
