var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var nodemailer = require('nodemailer');
var mongooseConnection = require('./models/mongooseConnection');
var session = require('client-sessions');
var index = require('./routes/index');
var users = require('./routes/users');
var registration=require('./routes/registration');
var dashboard=require('./routes/dashboard');
var appointment=require('./routes/appointment');
var doctor=require('./routes/doctor');
var message=require('./routes/message');
var app = express();
var server = require('http').Server(app);
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});
var fs      = require( 'fs' );
var config  = require( './config.json' );
var Fitbit  = require( 'fitbit-oauth2' );
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var tfile = 'fb-token.json';

var persist = {
  read: function( filename, cb ) {
    fs.readFile( filename, { encoding: 'utf8', flag: 'r' }, function( err, data ) {
      if ( err ) return cb( err );
      try {
        var token = JSON.parse( data );
        cb( null, token );
      } catch( err ) {
        cb( err );
      }
    });
  },
  write: function( filename, token, cb ) {
    console.log( 'persisting new token:', JSON.stringify( token ) );
    fs.writeFile( filename, JSON.stringify( token ), cb );
  }
};

// Instanciate a fitbit client.  See example config below.
//
var fitbit = new Fitbit( config.fitbit );
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({

  cookieName: 'session',
  secret: 'cmpe280_test_string',
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,  }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var currentUser = {};

wsServer.on('request', function(r){
    // Code here to run on connection
    var connection = r.accept('echo-protocol', r.origin);
    var count = 0;
    var clients = {};
    // Specific id for this client & increment count
    var id = count++;
// Store the connection method so we can loop through & contact all clients
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted [' + id + ']');
    var count=0;
    // Create event listener
    connection.on('message', function(message) {


        // The string message that was sent to us
        var msgString = message.utf8Data;

        console.log(msgString);
        // Loop through all clients
        function sendMessage() {
            for (var i in clients) {
                // Send a message to the client with the message
                var heartRate=Math.round((Math.random()*(104)+48));
                if(heartRate<50||heartRate>150){
                    if(count<10){
                        heartRate=Math.round((Math.random()*(100)+50));
                        count++;
                    }
                    else {
                        count = 0;
                        var smtpConfig = {
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // use SSL
                            auth: {
                                user: 'ehealth.cmpe280@gmail.com',
                                pass: 'cmpe280sjsu'
                            }
                        };
                        // create reusable transporter object using the default SMTP transport
                        var transporter = nodemailer.createTransport(smtpConfig);

                        // setup e-mail data with unicode symbols
                        var mailOptions = {
                            from: '"ehealth 👥" <ehealth.cmpe280@gmail.com>', // sender address
                            to: 'raghavendra.kps88@gmail.com', // list of receivers
                            subject: "Condition Report: " + currentUser.name, // Subject line
                            text: "Heart Rate of " + currentUser.name + " is out of normal range. Please take care of him / her.", // plaintext body
                            html: '<b>Heart Rate of</b>'+ currentUser.name + '<b>is out of normal range. Please take care of him</b>'// html body
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);
                        });
                    }
                }
                console.log(heartRate);
                clients[i].sendUTF(heartRate);
            }
            setTimeout(sendMessage,1000);
        }
        sendMessage();

    });
    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// In a browser, http://localhost:4000/fitbit to authorize a user for the first time.
//
app.get('/fitbitAuth', function (req, res) {
  if(req.session.user){
      currentUser = req.session.user;
      console.log("Session created : "+ req.session.user);
      res.redirect( fitbit.authorizeURL() );
  }
  else {
    console.log("Session Error");
  }
});
app.post('/addMessage',message.addMessage);

// Callback service parsing the authorization token and asking for the access token.  This
// endpoint is refered to in config.fitbit.authorization_uri.redirect_uri.  See example
// config below.
//
app.get('/callback', function (req, res, next) {
  var code = req.query.code;
  fitbit.fetchToken( code, function( err, token ) {
    if ( err ) return next( err );

    // persist the token
    persist.write( tfile, token, function( err ) {
      if ( err ) return next( err );

    });
  });
  res.render('patientDashBoard');
});
app.get('/doctorDash', doctor.doctorDash);
app.get('/getMessages',message.getMessages);
app.get('/patientDashboard', function (req,res,next) {
  res.render('patientDashBoard');

})
app.get( '/heart-daily', function( req, res, next ) {
    console.log("abcd : ");
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
//          uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
            uri: "https://api.fitbit.com/1/user/-/activities/heart/date/2016-12-03/1d/15min/time/00:00/23:59.json",
            method: 'GET',
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-heart-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                    var jsonArr = [];
                    var heartTime = [];
                    var obj = [];
                    obj = profile["activities-heart-intraday"].dataset;



                    for(var i = 0; i < obj.length ; i++){
                        jsonArr[i] = obj[i].value;
                        heartTime[i] = obj[i].time;
                    }
                    var ress = {
                        statusCode: 200,
                        time: heartTime
                        ,
                        value: jsonArr};

                    res.send(ress);
                    //res.send( '<pre>' + JSON.stringify( profile, null, 2 ) + '</pre>' );
                });

            }
            else
            // res.status(200).send({data1 : profile});
                var jsonArr = [];
            var heartTime = [];
            var obj = [];
            obj = profile["activities-heart-intraday"].dataset;



            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                heartTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: heartTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});

app.get( '/steps-daily', function( req, res, next ) {
    console.log("abcd : ");
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/steps/date/2016-12-03/1d/15min/time/00:00/23:59.json",

            //            uri: "https://api.fitbit.com/1/user/-/activities/floors/date/2016-11-21/1d/15min/time/00:30/12:45.json",
//        	uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
            method: 'GET',
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-heart-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                });

            }
            else
            // res.status(200).send({data1 : profile});
                var jsonArr = [];
            var calorieTime = [];
            var obj = [];
            obj = profile["activities-steps-intraday"].dataset;



            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                calorieTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: calorieTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});


app.get( '/calorie-daily', function( req, res, next ) {
    console.log("abcd : ");
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/calories/date/2016-12-03/1d/15min/time/00:00/23:59.json",

            //            uri: "https://api.fitbit.com/1/user/-/activities/floors/date/2016-11-21/1d/15min/time/00:30/12:45.json",
//        	uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
            method: 'GET',
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-heart-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                    var jsonArr = [];
                    var calorieTime = [];
                    var obj = [];
                    obj = profile["activities-calorie-intraday"].dataset;



                    for(var i = 0; i < obj.length ; i++){
                        jsonArr[i] = obj[i].value;
                        calorieTime[i] = obj[i].time;
                    }
                    var ress = {
                        statusCode: 200,
                        time: heartTime
                        ,
                        value: jsonArr};

                    res.send(ress);
                    //res.send( '<pre>' + JSON.stringify( profile, null, 2 ) + '</pre>' );
                });

            }
            else
            // res.status(200).send({data1 : profile});
                var jsonArr = [];
            var calorieTime = [];
            var obj = [];
            obj = profile["activities-calories-intraday"].dataset;



            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                calorieTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: calorieTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});

app.post( '/calorie-dynamic', function( req, res, next ) {

    var datedyn = req.param('dateA');
    console.log(datedyn);
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/calories/date/"+datedyn+"/1d/15min/time/00:00/23:59.json",

            //            uri: "https://api.fitbit.com/1/user/-/activities/floors/date/2016-11-21/1d/15min/time/00:30/12:45.json",
//        	uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
            method: 'GET'
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-heart-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                    var jsonArr = [];
                    var calorieTime = [];
                    var obj = [];
                    console.log("XYZ"+profile);
                    obj = profile["activities-calorie-intraday"].dataset;



                    for(var i = 0; i < obj.length ; i++){
                        jsonArr[i] = obj[i].value;
                        calorieTime[i] = obj[i].time;
                    }
                    var ress = {
                        statusCode: 200,
                        time: heartTime
                        ,
                        value: jsonArr};

                    res.send(ress);
                    //res.send( '<pre>' + JSON.stringify( profile, null, 2 ) + '</pre>' );
                });

            }
            else
            // res.status(200).send({data1 : profile});
                var jsonArr = [];
            var calorieTime = [];
            var obj = [];
            obj = profile["activities-calories-intraday"].dataset;



            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                calorieTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: calorieTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});

app.post( '/heart-dynamic', function( req, res, next ) {

    var datedyn = req.param('dateA');
    console.log(datedyn);
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/heart/date/"+datedyn+"/1d/15min/time/00:00/23:59.json",

            //            uri: "https://api.fitbit.com/1/user/-/activities/floors/date/2016-11-21/1d/15min/time/00:30/12:45.json",
//        	uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
            method: 'GET'
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-heart-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                });
            }
            else
                var jsonArr = [];
            var heartTime = [];
            var obj = [];
            obj = profile["activities-heart-intraday"].dataset;

            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                heartTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: heartTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});

app.post( '/steps-dynamic', function( req, res, next ) {

    var datedyn = req.param('dateA');
    console.log(datedyn);
    persist.read( tfile, function( err, token ) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Set the client's token
        console.log("token : " + token.toString());
        fitbit.setToken(token);


        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/steps/date/"+datedyn+"/1d/15min/time/00:00/23:59.json",

            //            uri: "https://api.fitbit.com/1/user/-/activities/floors/date/2016-11-21/1d/15min/time/00:30/12:45.json",
//        	uri: "https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json",
            method: 'GET'
        }, function( err, body, token ) {
            if ( err ) return next( err );
            var profile = JSON.parse( body );
            // if token is not null, a refesh has happened and we need to persist the new token
            //console.log("token : " + token + "aaa " + JSON.stringify(profile["activities-steps-intraday"].dataset[0].value));
            if ( token ) {
                console.log("abcd123 : " + token);
                persist.write( tfile, token, function( err ) {
                    if ( err ) return next( err );
                    //res.send({statusCode:200},{data1 : profile });
                });
            }
            else
                var jsonArr = [];
            var stepsTime = [];
            var obj = [];
            obj = profile["activities-steps-intraday"].dataset;

            for(var i = 0; i < obj.length ; i++){
                jsonArr[i] = obj[i].value;
                stepsTime[i] = obj[i].time;
            }
            var ress = {
                statusCode: 200,
                time: stepsTime
                ,
                value: jsonArr};

            res.send(ress);
        });
    });
});

app.get('/logout', function (req,res,next) {
  console.log(req.session.user);
  req.session.destroy();
    console.log("destroyed " + req.session.user);
        res.send({statusCode:200});
//res.render("index" , {title : Fitbit});
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/findDoctors', appointment.findDoctors);
app.get('/findPatients',appointment.findPatients);
app.get('/sessionValues', function (req,res,next) {
    console.log("IN get session " + req.session.user.name);
    res.send(req.session.user);

})
app.post('/patientDirectory' , appointment.findPatientsDiseases);
//post requests
app.post('/signup',registration.signup);
app.post('/signupDoctor', registration.signupDoctor);

app.post('/login', registration.login);
app.post('/loginDoctor' , registration.loginDoctor);
app.post('/bookAppointment', appointment.bookAppointment);
app.post('/patientData',appointment.getPatientAppointments);
app.post('/acceptAppointment',appointment.acceptPatientAppointment);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error pagenpm
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
