/**
 * Created by lokesh on 11/23/2016.
 */
var patient = require('../models/patientSchema');
var doctor = require('../models/doctorSchema');
var bcrypt=require('bcrypt-nodejs');

exports.signup=function(req,res){
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        var newPatient = patient({
            name: req.param("fullname"),
            userid: req.param("userid"),
            email: req.param("email"),
            password: hash,
            mobile:req.param("mobile"),
            birthdate:req.param("birthdate")
        });

        newPatient.save(function (err) {
            if(err) throw err;
            else console.log("User Created");
        });
        console.log(req.param("email"));
        res.send({statusCode:200});
    });

}

exports.signupDoctor=function(req,res){

    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        var newDoctor = doctor({
            name: req.param("fullname"),
            userid: req.param("userid"),
            email: req.param("email"),
            password: hash,
            gender: req.param("gender"),
            speciality: req.param("speciality"),
            mobile:req.param("mobile"),
            birthdate:req.param("birthdate")
        });

        newDoctor.save(function (err) {
            if(err) throw err;
            else console.log("User Created");
        });
        console.log(req.param("email"));
        res.send({statusCode:200});
    });

}
exports.login=function(req,res,next){

    console.log("in login"+req.param("email"));
    var email = req.param("email");
    var password = req.param("password");

    patient.findOne({email: email}, function (err, patient) {

        if(err) {
            console.log(err);
            res.send({statusCode:500});
        }
        else if(!patient){
            res.send({statusCode:404});
        }
        else {
            console.log(patient+'printing patient from mongodb');
            // Load hash from your password DB.
            bcrypt.compare(req.body.password, patient.password, function(err, result) {

                if(result == true) {
                    req.session.user = patient;
                    console.log("success login" + req.session.user);
                    res.send({statusCode: 200});
                }
            });

        }
        
    });

}

exports.loginDoctor=function(req,res){
    console.log("in login"+req.param("email"));
    var email = req.param("email");
    var password = req.param("password");

    doctor.findOne({email: email}, function (err, doctor) {
        if(err) {
            console.log(err);
            res.send({statusCode:500});
        }
        else if(!doctor){
            res.send({statusCode:404});
        }
        else {
            bcrypt.compare(req.body.password, doctor.password, function(err, result) {

                if(result == true) {
                    req.session.user = doctor;
                    console.log("success login Doctor" + req.session.user);
                    res.send({statusCode: 200});
                }
            });

        }

    });
}