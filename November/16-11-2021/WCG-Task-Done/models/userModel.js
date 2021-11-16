const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    hobbies: [String],
    city: {
      type: String,
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("jqueryPractice", tableSchema);
