/**
 * Created by lokesh on 11/23/2016.
 */
var mongoose = require("mongoose");
dbURI = 'mongodb://localhost/fitbitData';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

require('./patientSchema');
require('./doctorSchema');
require('./patientAppointmentSchema');
require('./patientRequestSchema');
module.exports = mongoose