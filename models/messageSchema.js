/**
 * Created by raghu on 11/30/2016.
 */
var mongoose = require("mongoose");

var message =  new mongoose.Schema({
    from: String,
    to: String,
    message: String

});

var messageSchema = mongoose.model('messageSchema', message);
module.exports = messageSchema;