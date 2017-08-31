/**
 * Created by lokesh on 11/21/2016.
 */
var mongoose = require("mongoose");

//model
//var first_name = mongoose.model('first_Name', {name: String});
var patientRegister =  new mongoose.Schema({
    name: String,
    userid: String,
    email: String,
    password: String,
    mobile: Number,
    birthdate: Date,
    appointmentId: [String],
    created_At: Date,
    Updated_At: Date
});

var patientSchema = mongoose.model('patientSchema', patientRegister);
module.exports = patientSchema;