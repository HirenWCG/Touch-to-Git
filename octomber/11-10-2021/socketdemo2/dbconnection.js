const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const url = "mongodb://socket:socket@localhost:27017/socket";

const connect = mongoose.connect(url, { useNewUrlParser: true });
module.exports = connect;
