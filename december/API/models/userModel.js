const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
  { strict: false }
);

module.exports = mongoose.model("users", tableSchema);
