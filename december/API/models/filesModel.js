const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    fieldMappingObject: {
      type: Object,
      default: null,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    duplicates: {
      type: Number,
      default: 0,
    },
    discarded: {
      type: Number,
      default: 0,
    },
    totalUploaded: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "success"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("files", tableSchema);
