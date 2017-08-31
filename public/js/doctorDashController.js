/**
 * Created by lokesh on 11/29/2016.
 */
/**
 * Created by lokesh on 11/26/2016.
 */
var doctorDashApp = angular.module('doctorDashApp', ['ui.router', 'ngStorage', 'ui.calendar', 'ui.bootstrap','pascalprecht.translate']);
doctorDashApp.config(function($stateProvider, $urlRouterProvider,$translateProvider) {

    $translateProvider.fallbackLanguage('en');
    $translateProvider.registerAvailableLanguageKeys(['en','es', 'fr'],{
        'en_*':'en',
        'es_*':'es',
        'fr_*':'fr'

    });
    $translateProvider.translations('en',{
        LOGIN: "Login" ,
        LOGIN_AS_PATIENT: "LOGIN AS PATIENT",
        EMAIL_ADDRESS: "Email Address",
        PASSWORD: "Password",
        DONT_HAVE_ACCOUNT:  "Don't have an account?",
        REGISTER_AS_PATIENT_CLIENT: "Register as patient or client using menubar at top-right",




    });
    $translateProvider.translations('es',{
        LOGIN: "लॉग इन करें",
        LOGIN_AS_PATIENT: "लॉग इन रोगी के रूप में",
        EMAIL_ADDRESS: "ईमेल पता",
        PASSWORD: "पासवर्ड",
        DONT_HAVE_ACCOUNT: "एक खाता नहीं है?",
        REGISTER_AS_PATIENT_CLIENT: "रोगी या ग्राहक शीर्ष सही पर मेनू बार का उपयोग कर के रूप में रजिस्टर"
    });
    $translateProvider.translations('fr',{
        LOGIN: "లాగిన్",
        LOGIN_AS_PATIENT: "రోగి లాగిన్",
        EMAIL_ADDRESS: "ఇమెయిల్ అడ్రస్",
        PASSWORD:"పాస్వర్డ్",
        DONT_HAVE_ACCOUNT:"ఖాతా లేదా?",
        REGISTER_AS_PATIENT_CLIENT:"కుడి ఎగువన మెనూబార్ ఉపయోగించడం ద్వారా రోగి లేదా క్లయింట్ వలె నమోదు",
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
                    templateUrl: '/ejs/newDoctorHeader.ejs',
                    controller: 'headerController'

                },
                'content': {
                    templateUrl: '/ejs/doctorSchedule.ejs',
                    controller: 'doctorScheduleController'
                }

            }
        })
        .state('app.appointment', {

            url: '/appointment',
            views : {
                'header@' : {
                    templateUrl: '/ejs/newDoctorHeader.ejs',
                    controller: 'headerController'
                }
                ,
                'content@': {
                    templateUrl: '/ejs/chatDoctor.ejs',
                    controller: 'doctorController'
                }
            }
        })
        .state('app.dashboard', {

            url: '/dashboard',
            views : {
                'header@' : {
                    templateUrl: '/ejs/newDoctorHeader.ejs',
                    controller: 'headerController'
                }
                ,
                'content@': {
                    templateUrl: '/ejs/doctorDash.ejs',
                    controller: 'doctorDashController'
                }
            }
        })
        .state('app.patientDirectory', {

            url: '/patientDirectory',
            views : {
                'header@' : {
                    templateUrl: '/ejs/newDoctorHeader.ejs',
                    controller: 'headerController'
                }
                ,
                'content@': {
                    templateUrl: '/ejs/patientDirectory.ejs',
                    controller: 'directoryController'
                }
            }
        })
        .state('app.chatDoctor', {

            url: '/chatDoctor',
            views : {
                'header@' : {
                    templateUrl: '/ejs/newDoctorHeader.ejs',
                    controller: 'headerController'
                }
                ,
                'content@': {
                    templateUrl: '/ejs/chatDoctor.ejs',
                    controller: 'chatDoctorController'
                }
            }
        })


});





doctorDashApp.controller('doctorScheduleController', function($scope, $filter, $compile, $timeout, uiCalendarConfig) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.q = '';
    
    
    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
    };

    $scope.calEventsExt = {
        color: '#f00',
        textColor: 'yellow',
        events: [
            {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add custom event*/
    $scope.addEvent = function() {
        $scope.events.push({
            title: 'New Event',
            start: new Date(y, m, d),
            end: new Date(y, m, d+1),
            className: ['newEvent']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
        $timeout(function() {
            if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

    $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo= 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

});
doctorDashApp.controller('chatDoctorController',['$scope', '$http', '$state', '$timeout','$translate',function($scope, $http, $state, $timeout, $translate){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    $scope.getMessages=function(){
        $http({
            method: "get",
            url: '/getMessages',

        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                $scope.messages=data.result;
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
    $scope.getPatients=function () {
        $scope.patientNames = [];
        $http({
            method : "GET",
            url : '/findPatients'
        }).success(function(data) {
            //checking the response data for statusCode
            console.log(data+'in the result');
            if (data.statusCode == 200) {
                var patients = data.result;
                console.log('result'+patients);
                for (i = 0; i < patients.length; i++) {
                    $scope.patientNames.push(patients[i].name);
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

                "patientName": $scope.patientName,
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

            }
            else if (data.statusCode == 500) {
                //window.location.href("error?message=Error");
            }
        }).error(function (error) {
            window.location.href("error?message=Error");
        });
    }
}]);


doctorDashApp.controller('headerController',['$scope', '$http', '$state','$localStorage','$translate','$window',function($scope, $http, $state,$localStorage, $translate,$window) {
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    getSessionValues = function () {
        $http({
            method : 'get',
            url : '/sessionValues'
        }).success(function(data1) {
            //checking the response data for statusCode
            console.log("SESSION NAME " +data1.name);
            $scope.userName = data1.name;
            getPatientCounts = function () {

                $http({
                    method: 'post',
                    url: '/patientDirectory',
                    data: {doctorName: data1.name}

                }).success(function (data) {
                    //checking the response data for statusCode
                    if(data.statusCode == "200") {
                        console.log("success patient counts : " + data.aging);
                        $localStorage.doctorName = data1.name;
                        $localStorage.aging = data.aging;
                        $localStorage.dental = data.dental;
                        $localStorage.eye = data.eye;
                        $localStorage.physio = data.physio;
                        //$localStorage.fitness = data.fitness;
                    }
                    else if(data.statusCode == "500") {
                        console.log("500 error");
                    }
                    else {
                        console.log("404 error");
                    }
                }).error(function (error) {
                    //handle error
                });
            }
            getPatientCounts();
        }).error(function(error) {
            //handle error
        });
    };



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

doctorDashApp.controller('directoryController',['$scope','$http','$state','$localStorage',function($scope,$http,$state,$localStorage){


}]);

doctorDashApp.controller('doctorDashController',['$scope', '$http', '$state','$localStorage','$translate','$window',function($scope, $http, $state,$localStorage,$translate, $window) {
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    getPatientData = function () {

        $http({
            method: 'post',
            url: '/patientData',
            data: {"doctorName": $localStorage.doctorName}

        }).success(function (data) {
            //checking the response data for statusCode
            if(data.statusCode == "200") {
                console.log("success patient Data : " + JSON.stringify(data));

                $scope.appointments = data.result;



            }
            else if(data.statusCode == "500") {
                console.log("500 error");
            }
            else {
                console.log("404 error");
            }
        }).error(function (error) {
            //handle error
        });
    }
    getPatientData();
    $scope.getData = function () {
 	   // needed for the pagination calc
 	   // https://docs.angularjs.org/api/ng/filter/filter
 	   return $filter('filter')($scope.appointments.name, $scope.q);
 }
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }
    
    $scope.acceptAppointment = function(appointment){

        $http({
            method: 'post',
            url: '/acceptAppointment',
            data: {"name": appointment.name,"service":appointment.service,
            "doctorName" : $localStorage.doctorName}

        }).success(function (data) {
            //checking the response data for statusCode
            if(data.statusCode == "200") {
                var idx = _.findIndex($scope.appointments, {"name": appointment.name,"service":appointment.service,
                    "doctorName" : $localStorage.doctorName} );
                $scope.appointments.splice(idx, 1);
            }
            else if(data.statusCode == "500") {
                console.log("500 error");
            }
            else {
                console.log("404 error");
            }
        }).error(function (error) {
            //handle error
        });

    }

    //ng-class='{selected: isSelected(person)}'
}]);

doctorDashApp.filter('startFrom', function() {
	 return function(input, start) {
	     start = +start; //parse to int
	     return input.slice(start);
	 }
	});
