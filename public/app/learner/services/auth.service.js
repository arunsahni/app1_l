(function () {
    'use strict';

    angular
            .module('la-app')
            .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$localStorage', '$state','$auth'];
    function AuthService($http, $localStorage, $state, $auth) {

        var service = {
            registerLearner: registerLearner,
            registerTutor: registerTutor,
            loginTutor: loginTutor,
            loginLearner: loginLearner,
            logoutLearner: logoutLearner,
            fastSignUp: fastSignUp,
            beforeLogin: beforeLogin,
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


        function registerTutor(postData) {

            $http.post(webservices.tutorsignup, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        }
                    })
                    .error(function (error) {
                        callback(false);
                    });
        }


        function loginTutor(postData, callback) {
            $http.post(webservices.tutorlogin, postData)
                    .success(function (response) {
                        if (response.token) {
                            $localStorage.currentUser = {token: response.token, type: response.type, id: response.data._id, email: response.data.email, info: response.data.personalInfo};
                            $localStorage.loginstatus = true;

                            $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (data) {

                    });
        }

        function loginLearner(postData, callback) {
            $http.post(webservices.learnerlogin, postData)
                    .success(function (response) {
                        if (response.token) {
                            $localStorage.currentUser = {token: response.token, type: response.type, id: response.data._id, email: response.data.email, info: response.data.personalInfo};
                            $localStorage.loginstatus = true;

                            $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (data) {

                    });
        }

        function logoutLearner() {
            if($localStorage.currentUser) {
                delete $localStorage.currentUser.token;
            }
            $localStorage.loginstatus = false;
            $auth.logout();
            $http.defaults.headers.common.Authorization = undefined;
            $state.go('anon.home');
        }

        function fastSignUp(postData, callback) {

            $http.post(webservices.fastlearnersignup, postData)
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

        function beforeLogin(postData, callback) {
            var serviceUrl = webservices.beforelogin + '/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if (response.status == 200) {
                            $localStorage.currentUser = {type: 'learner', id: response.data._id, email: response.data.email, info: response.data.personalInfo};
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (error) {
                        callback(error);
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
                    .error(function (error) {
                        callback(error);
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
