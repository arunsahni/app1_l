(function () {
    'use strict';

    angular
            .module('tutor-app')
            .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$localStorage', '$state'];
    function AuthService($http, $localStorage, $state) {

        var service = {
            registerLearner: registerLearner,
            registerTutor: registerTutor,
            loginTutor: loginTutor,
            logoutTutor: logoutTutor,
            beforeLogin: beforeLogin,
            fastSignUp: fastSignUp,
            forgotpwd: forgotpwd,
            verifyEmail : verifyEmail
        };

        return service;


        function registerLearner(postData, callback) {
            $http.post(webservices.learnersignup, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(result.msg);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        function registerTutor(postData, callback) {
            $http.post(webservices.tutorsignup, postData)
                    .success(function (result) {
                        console.log(result);
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(result.msg);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        function loginTutor(postData, callback) {
            $http.post(webservices.tutorlogin, postData)
                    .success(function (response) {
                        if (response.token) {
                            $localStorage.currentTutor = {token: response.token, type: response.type, id: response.data._id, email: response.data.email, info: response.data.personalInfo};
                            $localStorage.tutorstatus = true;

                            $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (data) {

                    });
        }


        function logoutTutor() {
            if($localStorage.currentTutor) {
                delete $localStorage.currentTutor.token;
            }
            $localStorage.tutorstatus = false;
            $http.defaults.headers.common.Authorization = undefined;
            $state.go('anon.home');
        }

        function beforeLogin(postData, callback) {
            var serviceUrl = webservices.beforelogin + '/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {console.log(response);
                        if (response.status === 200) {
                            $localStorage.currentTutor = {type: 'tutor', id: response.data._id, email: response.data.email, info: response.data.personalInfo};
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (error) {
                        callback(error);
                    });
        }
        
        function fastSignUp(postData, callback) {

            $http.post(webservices.fastsignup, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(result.msg);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }
        
        function forgotpwd(postData, callback) {
            $http.post(webservices.forgotpwd, postData)
                    .success(function (response) {
                        if (response.status === 200) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        
        function verifyEmail(postData, callback) {
            var serviceUrl = webservices.verifyemail + '/' + postData;
            return $http.get(serviceUrl)
                    .success(function (response) {
                        if (response.status === 200) {
                            callback(response);
                        } else {
                            callback(response);
                        }
                    })
                    .error(function () {
                        callback();
                    });
        }        


    }

})();