(function () {
    'use strict';

    angular
            .module('tutor-app')
            .factory('AccountService', AccountService);

    AccountService.$inject = ['$http', '$localStorage', '$state'];
    function AccountService($http, $localStorage, $state) {

        var service = {
            updateTutorProfile: updateTutorProfile,
            updateAlertNotifications: updateAlertNotifications,
            changeTutorPassword: changeTutorPassword,
            changeTutorEmail: changeTutorEmail,
            changeTutorMobileNo: changeTutorMobileNo,
            getNotificationsConfig: getNotificationsConfig,
            getVerificationCode: getVerificationCode,
            updateBank: updateBank,
            getBanksData : getBanksData,
            addExperience : addExperience
        };

        return service;

        function updateTutorProfile(postData, callback) {
            $http.post(webservices.updatetutordetail, postData)
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

        function updateAlertNotifications(postData, callback) {
            $http.post(webservices.updatetutoralertnotifications, postData)
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

        function changeTutorPassword(postData, callback) {
            console.log(postData);
            $http.post(webservices.updatetutorpassword, postData)
                    .success(function (response) {
                        if (response.status === 200) {
                            console.log(response)
                            callback(true);
                        }else if(response.status === 401){
                            callback('notmatch')
                        } else {
                            return false;
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        function changeTutorEmail(postData, callback) {
            $http.post(webservices.updatetutoremail, postData)
                    .success(function (response) {
                        if (response.status === 200) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(true);
                    });
        }

        function changeTutorMobileNo(postData, callback) {
            $http.post(webservices.updatetutormobile, postData)
                    .success(function (response) {
                        if (response.status === 200) {
                            callback(true);
                        }

                    })
                    .error(function (response) {
                        callback(false);
                    });
        }

        function getNotificationsConfig(postData,callback) {
            var serviceUrl = webservices.getnotificationsconfig + '/' + postData;
            
            $http.get(serviceUrl)
                    .success(function (response) {
                        if (response.status === 200) {
                            console.log(response)
                            callback(response.data);
                        }

                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
   

        function getVerificationCode(postData, callback) {
            $http.post(webservices.verifytutormobile, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });

        }
        
        function updateBank(postData, callback) {
            $http.post(webservices.updatetutorbankingdetails, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }
        
        function getBanksData(callback) {
            $http.get(webservices.getbanksdata)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(result.data);
                        } else {
                            callback(result.msg);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        function addExperience(postData, callback) {
            $http.post(webservices.addexperience, postData)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }
        
    }

})();