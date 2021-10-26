const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("saltEncryption", tableSchema);
