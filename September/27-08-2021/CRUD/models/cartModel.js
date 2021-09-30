const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  userId: {
    user_id: String,
    username: String,
  },
  products: [
    {
      productId: Number,
      name: String,
      price: Number,
    },
  ],
});

module.exports = mongoose.model("cartModel", tableSchema);
