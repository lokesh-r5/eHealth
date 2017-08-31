/**
 * Created by lokesh on 11/26/2016.
 */
var patientDashApp = angular.module('patientDashApp', ['ui.router', 'ngStorage','highcharts-ng', 'pascalprecht.translate']);
patientDashApp.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.fallbackLanguage('en');
    $translateProvider.registerAvailableLanguageKeys(['en','es','fr'],{
        'en_*':'en',
        'es_*':'es',
        'fr_*':'fr'
    });
    $translateProvider.translations('en',{
        BOOK_AN_APPOINTMENT: "BOOK AN APPOINTMENT",
        NAME: "Name",
        DATE_OF_BIRTH: "Date Of Birth",
        GENDER: "Gender",
        MALE: "Male",
        FEMALE: "Female",
        DENTAL_CARE: "Dental Care",
        AGING_SOLUTIONS: "Aging Solutions",
        EYE_CARE: "Eye Care",
        PHYSIOTHERAPY: "Physiotherapy",
        FITNESS: "Fitness",
        DOCTOR_NAME: "Doctor Name",
        APPOINTMENT_DATE: "Appointment Date",
        PHONE_NUMBER: "Phone Number",
        SERVICE_DESCRIPTION: "Service Description",
        SERVICE: "Service",
        BOOK_APPOINTMENT: "Book Appointment",
        EMAIL:"Email",
        DOCTOR_NAME: "Doctor Name",
        MESSAGES:"Message",
        SEND_MESSAGE: "Send Message",
        YOUR_MESSAGES: "Your Messages",
        DOCTOR_DIRECTORY: "DOCTOR DIRECTORY",


    });
    $translateProvider.translations('es',{
        BOOK_AN_APPOINTMENT: "एक अपॉइंटमेंट बुक करें",
        NAME: "नाम",
        DATE_OF_BIRTH: "जन्म की तारीख",
        GENDER: "लिंग",
        MALE: "नर",
        FEMALE: "महिला",
        DENTAL_CARE: "दाँतों की देखभाल",
        AGING_SOLUTIONS: "एजिंग समाधान",
        EYE_CARE: "आंख की देखभाल",
        PHYSIOTHERAPY: "फिजियोथेरेपी",
        FITNESS: "स्वास्थ्य",
        DOCTOR_NAME: "डॉक्टर का नाम",
        APPOINTMENT_DATE: "मिलने की तारीख",
        PHONE_NUMBER: "फ़ोन नंबर",
        SERVICE_DESCRIPTION: "सेवा विवरण",
        SERVICE: "सर्विस",
        BOOK_APPOINTMENT: "निर्धारित तारीख बुक करना",
        EMAIL:"ईमेल",
        DOCTOR_NAME: "डॉक्टर का नाम",
        MESSAGES:"मेसेज",
        SEND_MESSAGE: "मेसेज भेजें",
        YOUR_MESSAGES: "आपके संदेश",
        DOCTOR_DIRECTORY: "डॉक्टर निर्देशिका",

    });

    $translateProvider.translations('fr',{
        BOOK_AN_APPOINTMENT: "బుక్ అపాయింట్మెంట్",
        NAME: "పేరు",
        DATE_OF_BIRTH: "పుట్టిన తేది",
        GENDER: "జెండర్",
        MALE: "మగ",
        FEMALE: "మహిళ",
        DENTAL_CARE: "డెంటల్ రక్షణ",
        AGING_SOLUTIONS: "ఏజింగ్ సొల్యూషన్స్",
        EYE_CARE: "ఐ కేర్",
        PHYSIOTHERAPY: "ఫిజియోథెరపీ",
        FITNESS: "ఫిట్నెస్",
        DOCTOR_NAME: "డాక్టర్ పేరు",
        APPOINTMENT_DATE: "నియామకం తేదీ",
        PHONE_NUMBER: "ఫోను నంబరు",
        SERVICE_DESCRIPTION: "సర్వీస్ వివరణ",
        SERVICE: "సర్వీస్",
        BOOK_APPOINTMENT: "బుక్ అపాయింట్మెంట్",
        EMAIL:"ఇమెయిల్",
        DOCTOR_NAME: "డాక్టర్ పేరు",
        MESSAGES: "సందేశము",
        SEND_MESSAGE: "సందేశము పంపుము",
        YOUR_MESSAGES: "మీ సందేశాలు",
        DOCTOR_DIRECTORY: "డాక్టర్ డైరెక్టరీ",

    });


    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.preferredLanguage('en');

    $urlRouterProvider.otherwise('/');

$stateProvider

// route for the home page
    .state('app', {
        url: '/',
        views: {
            'header':{
                templateUrl: '/ejs/newPatientHeader.ejs',
                controller: 'headerController'


            },
            'content': {
                templateUrl: '/ejs/patientFitbit.ejs',
                controller: 'patientController'
            }

        }
    })
    .state('app.appointment', {

        url: '/appointment',
        views : {
            'header@' : {
                templateUrl: '/ejs/newPatientHeader.ejs',
                controller: 'headerController'
            }
            ,
            'content@': {
                templateUrl: '/ejs/bookAppointment.ejs',
                controller: 'appointmentController'
            }
        }
    })
    .state('app.heartRate', {

        url: '/heartRate',
        views : {
            'header@' : {
                templateUrl: '/ejs/newPatientHeader.ejs',
                controller: 'headerController'
            }
            ,
            'content@': {
                templateUrl: '/ejs/heartRate.ejs',
                controller: 'heartRateController'
            }
        }
    })
    .state('app.doctorDirectory', {

        url: '/doctorDirectory',
        views : {
            'header@' : {
                templateUrl: '/ejs/newPatientHeader.ejs',
                controller: 'headerController'
            }
            ,
            'content@': {
                templateUrl: '/ejs/doctorDirectory.ejs',
                controller: 'doctorDirectoryController'
            }
        }
    })
    .state('app.chat', {

        url: '/chat',
        views : {
            'header@' : {
                templateUrl: '/ejs/newPatientHeader.ejs',
                controller: 'headerController'
            }
            ,
            'content@': {
                templateUrl: '/ejs/chatPatient.ejs',
                controller: 'chatPatientController'
            }
        }
    })


});


patientDashApp.controller('patientController',['$scope','$http','$state', '$translate',function($scope,$http,$state, $translate){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    fetchFitbitData = function () {

        $http({

            method : "get",

            url : "/heart-daily"

        }).success(function (data) {

            if(data.statusCode == 200) {

                $scope.heart = {

                    options: {

                        chart: {

                            type: 'line',

                            zoomType: 'x'

                        }

                    },

                    series: [{

                        data: data.value

                    }],

                    title: {

                        text: 'Your Heart Bit'

                    },

                    xAxis: {

                        categories: data.time

                    },

                    loading: false

                }

            }

            else

            {

                console.log("eror")

            }

        }).error(function(error) {

            //handle error

        });

    }



    fetchFitbitData();



    fetchFitbitData1 = function () {

        $http({

            method : "get",

            url : "/calorie-daily"

        }).success(function (data) {

            if(data.statusCode == 200) {

                $scope.calorie = {

                    options: {

                        chart: {

                            type: 'line',

                            zoomType: 'x'

                        }

                    },

                    series: [{

                        data: data.value

                    }],

                    title: {

                        text: 'Your Calories Burnt'

                    },

                    xAxis: {

                        categories: data.time

                    },

                    loading: false

                }

            }

            else

            {

                console.log("eror")

            }

        }).error(function(error) {

            //handle error

        });

    }



    fetchFitbitData1();



    fetchFitbitData2 = function () {

        $http({

            method : "get",

            url : "/steps-daily"

        }).success(function (data) {

            console.log(data);

            if(data.statusCode == 200) {

                $scope.steps = {

                    options: {

                        chart: {

                            type: 'line',

                            zoomType: 'x'

                        }

                    },

                    series: [{

                        data: data.value

                    }],

                    title: {

                        text: 'You Walked'

                    },

                    xAxis: {

                        categories: data.time

                    },

                    loading: false

                }

            }

            else

            {

                console.log("eror")

            }

        }).error(function(error) {

            //handle error

        });

    }



    fetchFitbitData2();





//dynamic date code

    fetchCaloriesDynamically = function () {



        $http({

            method : "post",

            url : "/calorie-dynamic",

            data : {

                "dateA": $scope.start

            }



        }).success(function (data) {



            console.log(data);

            if(data.statusCode == 200) {

                console.log(data);

                $scope.calorie.series.push({

                    data: data.value

                })

            }

            else

            {

                console.log("eror")

            }

        }).error(function(error) {

            //handle error

        });

    }

    fetchHeartDynamically = function () {



        $http({

            method : "post",

            url : "/heart-dynamic",

            data : {

                "dateA": $scope.start

            }



        }).success(function (data) {



            console.log(data);

            if(data.statusCode == 200) {

                console.log(data);

                $scope.heart.series.push({

                    data: data.value

                })

            }

            else

            {

                console.log("eror")

            }

        }).error(function(error) {

            //handle error

        });

    }


    fetchStepsDynamically = function () {



        $http({

            method : "post",

            url : "/steps-dynamic",

            data : {

                "dateA": $scope.start

            }



        }).success(function (data) {

            console.log(data);

            if(data.statusCode == 200) {

                console.log(data);

                $scope.steps.series.push({

                    data: data.value

                })

            }

            else

            {

                console.log("eror")

            }

            return data.value;

        }).error(function(error) {

            //handle error

        });

    }





    $scope.fetchDynamicDate = function(){

        fetchCaloriesDynamically();

        fetchStepsDynamically();

        fetchHeartDynamically();



    }



}]);


patientDashApp.controller('heartRateController',['$scope','$http','$state','$translate','$window',function($scope,$http,$state,$translate,$window){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }

    $scope.getData=function(){
        //console.log('inside test');
        var socket = new WebSocket('ws://localhost:3000', 'echo-protocol');
        $scope.socket=socket;


        $scope.createSocket=function(){

            //$scope.score=0;
            //$scope.socket.disconnect();
        }
        //
        var flag=0;
        $scope.waitForConnection=function() {
            if (socket.readyState == 1) {
                flag=1;
                $scope.readingArr = [];
                $scope.socket.addEventListener("message", function(e) {
                    // The data is simply the message that we're sending back
                    // Create the chart
                    console.log(e.data);
                    $scope.readingArr.push(e.data);
                    //$scope.requestData(e.data);
                });
                function  closeIt() {
                    $scope.socket.close();
                }
                //setTimeout(closeIt,10000);

                var chart;
                console.log("inside create soccet");

                console.log(socket.readyState);
                $scope.socket.send('hello-  test');


                $scope.chart = Highcharts.chart({
                    chart: {
                        renderTo: 'graphDiv',
                        defaultSeriesType: 'spline',
                        events: {
                            load: function () {

                                var series = this.series[0];
                                setInterval(function () {
                                    var shift = series.data.length > 20,
                                        point = 0,
                                        x = new Date().getTime();
                                    if (typeof $scope.readingArr !== 'undefined' && $scope.readingArr.length > 0) {
                                        // the array is defined and has at least one element
                                        point = parseInt($scope.readingArr.shift());
                                        console.log("New point is : "+point);
                                    }
                                    console.log("Adding point : "+point);

                                    series.addPoint([x, point], true, shift);
                                    console.log(series);
                                },1000);
                            }
                        }
                    },
                    title: {
                        text: 'Live data feed'
                    },

                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                        maxZoom: 20 * 1000
                    },
                    yAxis: {
                        minPadding: 0.2,
                        maxPadding: 0.2,
                        title: {
                            text: 'Value',
                            margin: 80
                        }
                    },

                    series: [{
                        name: 'Time',
                        data: []
                    }]
                });
            }
            else{
                setTimeout($scope.waitForConnection,1000);
            }
        }
        if(flag==0){
            $scope.waitForConnection();
        }


    }
}]);

patientDashApp.controller('appointmentController',['$scope', '$http', '$state','$translate', '$window',function($scope, $http, $state,$translate, $window){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    $scope.doctorNames = [];
    $http({
        method : "GET",
        url : '/findDoctors'
    }).success(function(data) {
        //checking the response data for statusCode
        if (data.statusCode == 200) {
            var doctors = data.result;
            for (i = 0; i < doctors.length; i++) {
                $scope.doctorNames.push(doctors[i].name);
            }
        }
        else {
            //handle error
        }
    }).error(function(error) {
        //handle error
    });

    $scope.bookAppointment = function() {
        $http({
            method : "POST",
            url : '/bookAppointment',
            data : {
                "name": $scope.name,
                "dob": $scope.dob,
                "gender": $scope.gender,
                "service": $scope.service,
                "doctorName": $scope.doctorName,
                "appointmentDate": $scope.appointmentDate,
                "email":$scope.email,
                "phone":$scope.phone,
                "serviceDesc" : $scope.serviceDesc
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                //registration success
                console.log(data);
                $state.transitionTo('app');
            }
            else {
                //handle error
            }
        }).error(function(error) {
            //handle error
        });
    };
}]);




patientDashApp.controller('doctorDirectoryController',['$scope', '$http', '$state','$translate', '$window',function($scope, $http, $state,$translate, $window){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    $scope.doctors = [];
    $http({
        method : "GET",
        url : '/findDoctors'
    }).success(function(data) {
        //checking the response data for statusCode
        if (data.statusCode == 200) {
            var maleNum = 1;
            var femaleNum = 1;
            $scope.doctors = data.result;
            for (var i=0; i<$scope.doctors.length; i++) {
                $scope.doctors[i].num = $scope.doctors[i].gender == 'male' ? maleNum++ : femaleNum++;
            }
        }
        else {
            //handle error
        }
    }).error(function(error) {
        //handle error
    });


}]);

patientDashApp.controller('headerController',['$scope', '$http', '$state','$localStorage','$translate', '$window',function($scope, $http, $state,$localStorage,$translate, $window) {
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    getSessionValues = function () {
        $http({
            method: 'get',
            url: '/sessionValues'
        }).success(function (data) {
            //checking the response data for statusCode
            console.log("SESSION NAME " + data.name);
            $scope.userName = data.name;
        }).error(function (error) {
            //handle error
        });
    }
    getSessionValues();

    $scope.logout = function() {


        $localStorage.$reset();
        $http({
            method: 'get',
            url: '/logout'
        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                window.location.assign('/');
            }

        }).error(function (error) {
            //window.location.href("error?message=Error");
        });

    }
}]);

patientDashApp.controller('chatPatientController',['$scope', '$http', '$state','$translate', '$timeout', function($scope, $http, $state,$translate, $timeout){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    $scope.getDoctors=function () {
        $scope.doctorNames = [];
        $http({
            method : "GET",
            url : '/findDoctors'
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                var doctors = data.result;
                console.log('result'+doctors);
                for (i = 0; i < doctors.length; i++) {
                    $scope.doctorNames.push(doctors[i].name);
                }
            }
            else {
                //handle error
            }
        }).error(function(error) {
            //handle error
        });
    }
    $scope.sendMessage=function() {
        console.log('inside send message');
        $http({
            method: "post",
            url: '/addMessage',
            data: {

                "doctorName": $scope.doctorName,
                "message": $scope.message
            }
        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                $scope.showMessage = true;
                $timeout(function () {
                    $scope.showMessage = false;
                }, 5000);
            }
            else if (data.statusCode == 404) {
                //alert(" User doesnot exists ! Pleasecheck you email or password. ");
                //$scope.email = "";
                //$scope.password = "";
                //focus('exampleInputEmail1');
            }
            else if (data.statusCode == 500) {
                //window.location.href("error?message=Error");
            }
        }).error(function (error) {
            window.location.href("error?message=Error");
        });
    }
    $scope.getMessages=function(){
        $http({
            method: "get",
            url: '/getMessages',

        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                $scope.messages=data.result;
                console.log(data.result+'success');
            }
            else if (data.statusCode == 404) {
                console.log("no data found");
                //alert(" User doesnot exists ! Pleasecheck you email or password. ");
                //$scope.email = "";
                //$scope.password = "";
                //focus('exampleInputEmail1');
            }
            else if (data.statusCode == 500) {
                //window.location.href("error?message=Error");
            }
        }).error(function (error) {
            window.location.href("error?message=Error");
        });
    }
}]);
