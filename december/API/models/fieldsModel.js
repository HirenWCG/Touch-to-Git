const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    fields: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("fields", tableSchema);
