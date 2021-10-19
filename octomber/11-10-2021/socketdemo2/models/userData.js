var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    message : String,
   
});

module.exports = mongoose.model('userChat', userSchema);