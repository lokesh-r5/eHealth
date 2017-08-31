var appointment = require('../models/appointmentSchema');
var doctor = require('../models/doctorSchema');
var patient=require('../models/patientSchema');

exports.bookAppointment = function(req, res){
    var newAppointment = appointment({
        name: req.param("name"),
        dob: req.param("dob"),
        gender: req.param("gender"),
        service: req.param("service"),
        doctorName: req.param("doctorName"),
        acceptStatus : false,
        appointmentDate: req.param("appointmentDate"),
        email: req.param("email"),
        phone: req.param("phone"),
        serviceDesc: req.param("serviceDesc")
    });

    newAppointment.save(function (err) {
        if(err) throw err;
        else console.log("Appointment Created");
    });
    res.send({statusCode:200});
};

exports.findDoctors = function(req, res){
    doctor.find({}, function (err, doctors) {
        if(err) {
            console.log(err);
            res.send({statusCode:500, result: []});
        } else if(!doctors.length){
            res.send({statusCode:404, result: []});
        } else {
            res.send({statusCode:200, result: doctors});
        }

    });
};

exports.findPatients=function(req,res) {
    patient.find({}, function (err, patients) {
        if (err) {
            console.log(err);
            res.send({statusCode: 500, result: []});
        } else if (!patients.length) {
            res.send({statusCode: 404, result: []});
        } else {
            res.send({statusCode: 200, result: patients});
        }
    });
}



exports.findPatientsDiseases = function(req, res){
var abc = 0;
    var doctorName = req.param('doctorName');
    console.log(" find patients : " + doctorName);
    appointment.find({"doctorName":doctorName,"service":"Aging Solution"}
    ).count( function (err, count) {
        console.log("count " + count);
        var aging = count
        appointment.find({"doctorName":doctorName,"service":"Dental Care"}
        ).count( function (err, count1) {
            console.log("count1 " + count1);
            var dental = count1;
            appointment.find({"doctorName":doctorName,"service":"Eye Care"}
            ).count( function (err, count2) {
                console.log("count2 " + count2);
                var eye = count2;
                appointment.find({"doctorName":doctorName,"service":"Physiotherapy"}
                ).count( function (err, count3) {
                    console.log("count3 " + count3);
                    var physio = count3;
                    res.send({statusCode : 200 , aging : aging, dental :dental, eye :eye,physio :physio });
                });


            });

        });
    });



};

exports.getPatientAppointments = function (req,res) {
  var doctorName = req.param('doctorName');

    //console("patient data server " + typeof (doctorName));
    appointment.find({doctorName : doctorName , acceptStatus: false}, function (err, appointments) {
        if(err) {
            console.log(err);
            res.send({statusCode:500, result: []});
        } else if(!appointments.length){
            res.send({statusCode:404, result: []});
        } else {
            res.send({statusCode:200, result: appointments});
        }
    });

}

exports.acceptPatientAppointment = function (req,res) {
    console.log("pa name : " + req.param('name'));
    appointment.findOne({name : req.param('name'), service : req.param('service')}, function (err,stat) {
        if(err) {
            console.log(err);
           res.send({statusCode:500, result: []});
        } else {
            console.log('status ' + stat.acceptStatus);
            stat.acceptStatus = true;
            stat.save()
        }
    })
    appointment.find({doctorName : req.param('doctorName') , acceptStatus: false}, function (err, appointments1) {
        if(err) {
            console.log(err);
            res.send({statusCode:500, result1: []});
        } else if(!appointments1.length){
            res.send({statusCode:404, result1: []});
        } else {
            res.send({statusCode:200, result1: appointments1});
        }

    });
}