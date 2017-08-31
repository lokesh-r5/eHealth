/**
 * Created by lokesh on 11/21/2016.
 */
var mongoose = require('mongoose');
//model
//var first_name = mongoose.model('first_Name', {name: String});
var doctorRegister =  new mongoose.Schema({
    name: String,
    userid: String,
    email: String,
    password: String,
    gender: String,
    mobile: Number,
    speciality: String,
    patientList: [String],
    birthdate: Date,
    created_At: Date,
    Updated_At: Date
});

var doctorSchema = mongoose.model('doctorSchema', doctorRegister);
module.exports = doctorSchema;