var routerApp = angular.module('routerApp', ['ui.router', 'ngStorage','pascalprecht.translate']);
routerApp.config(function($stateProvider, $urlRouterProvider,$translateProvider) {

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
                    templateUrl: '/ejs/header.ejs',


                },
                'content': {
                    templateUrl: '/ejs/newHeader.ejs',

                }

            }
        })
        .state('app.signup',{
            url:'signup',
            views: {
                'header':{
                    templateUrl: '/ejs/header.ejs',


                },
                'content@':{
                    templateUrl: '/ejs/signup.ejs',
                    controller: 'signupController'
                }
            }
        })
        .state('app.signupDoctor',{
                url:'signupDoctor',
            views: {
                'header':{
                    templateUrl: '/ejs/header.ejs',


                },
                    'content@':{
                        templateUrl: '/ejs/signupDoctor.ejs',
                        controller: 'signupController'
                    }
            }
        })
        .state('app.loginDoctor',{
            url:'loginDoctor',
            views: {
                'header':{
                    templateUrl: '/ejs/header.ejs',


                },
                'content@':{
                    templateUrl: '/ejs/loginDoctor.ejs',
                    controller: 'loginController'
                }
            }
        })
        .state('app.loginpage',{
            url:'loginpage',
            views: {
                'header':{
                    templateUrl: '/ejs/header.ejs',


                },
                'content@':{
                    templateUrl: '/ejs/loginpage.ejs',
                    controller: 'loginController'
                }
            }
        })

});

routerApp.controller('loginController',['$scope', '$http', '$state','$translate',function($scope, $http, $state,$translate){


    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    $scope.login=function(){
        console.log($scope.email+' '+$scope.password);
        $http({
            method : "post",
            url : '/login',
            data : {

                "email":$scope.email,
                "password" : $scope.password
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                console.log("Successfully Logged In")
                //login success

                window.location.assign('/fitbitAuth');
            }
            else if(data.statusCode == 404) {
                alert(" User doesnot exists ! Pleasecheck you email or password. ");
                $scope.email = "";
                $scope.password = "";
                focus('exampleInputEmail1');
            }
            else if(data.statusCode == 500) {
                window.location.href("error?message=Error");
            }
        }).error(function(error) {
            window.location.href("error?message=Error");
        });

    }

    //function for login doctor
    $scope.loginDoctor=function(){
        console.log($scope.email+' '+$scope.password);
        $http({
            method : "post",
            url : '/loginDoctor',
            data : {

                "email":$scope.email,
                "password" : $scope.password
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                console.log("Successfully Logged In as Doctor")
                //login success

                window.location.assign('/doctorDash');
            }
            else if(data.statusCode == 404) {
                alert(" User doesnot exists ! Pleasecheck you email or password. ");

            }
            else if(data.statusCode == 500) {
                window.location.href("error?message=Error");
            }
        }).error(function(error) {
            window.location.href("error?message=Error");
        });

    }
}]);
routerApp.controller('signupController',['$scope', '$http', '$state', '$translate','$window',function($scope, $http, $state,$translate, $window){
    $scope.changeLanguage = function(key){
        $translate.use(key);
    }
    console.log($scope.userid+' '+$scope.email+' '+$scope.password);
    $scope.signup = function() {
        $http({
            method : "POST",
            url : '/signup',
            data : {
                "fullname":$scope.fullname,
                "userid": $scope.userid,
                "email":$scope.email,
                "password" : $scope.password,
                "confirmpassword" : $scope.confirmpassword,
                "mobile" : $scope.mobile,
                "birthdate" : $scope.birthdate
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
    // Sign Up function for doctor
    $scope.signupDoctor = function() {
        $http({
            method : "POST",
            url : '/signupDoctor',
            data : {
                "fullname":$scope.fullname,
                "userid": $scope.userid,
                "email":$scope.email,
                "password" : $scope.password,
                "confirmpassword" : $scope.confirmpassword,
                "gender" : $scope.gender,
                "speciality" : $scope.speciality,
                "mobile" : $scope.mobile,
                "birthdate" : $scope.birthdate
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

