var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var myschema = new Schema({
  categoryName: String,
});

module.exports = mongoose.model("Category", myschema);
