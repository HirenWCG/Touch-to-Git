var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var myschema = new Schema({
  socketId: String,
  senderName: String,
  roomName: String,
  senderMsg: String,
  msgTime: String,
});

module.exports = mongoose.model("saveChat", myschema);
