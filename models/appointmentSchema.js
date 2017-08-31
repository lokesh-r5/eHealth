var mongoose = require("mongoose");

var appointment =  new mongoose.Schema({
    name: String,
    dob: Date,
    gender: String,
    service: String,
    doctorName: String,
    acceptStatus : Boolean,
    appointmentDate: String,
    email: String,
    phone: String,
    serviceDesc: String,
    created_At: Date,
    Updated_At: Date
});

var appointmentSchema = mongoose.model('appointmentSchema', appointment);
module.exports = appointmentSchema;