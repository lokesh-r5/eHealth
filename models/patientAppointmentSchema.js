/**
 * Created by devanshis24 on 11/21/2016.
 */
var mongoose = require("mongoose");

//model
//var first_name = mongoose.model('first_Name', {name: String});
var patientAppointment =  new mongoose.Schema({
    patientId: String,
    name: String,
    address: String,
    date: String,
    time: Number,
    doctorId: String,
    created_At: Date,
    Updated_At: Date
});

var patientAppointments = mongoose.model('patientAppointmentSchema', patientAppointment);
module.exports = patientAppointments;
