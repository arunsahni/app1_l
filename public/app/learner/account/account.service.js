(function () {
    'use strict';

    angular
            .module('la-app')
            .factory('AccountService', AccountService);

    AccountService.$inject = ['$http','$localStorage','$state'];
    function AccountService($http, $localStorage, $state) {

        var service = {
            updateLearnerProfile: updateLearnerProfile,
            updateAlertNotifications: updateAlertNotifications,
            changeLearnerPassword: changeLearnerPassword,
            changeLearnerEmail: changeLearnerEmail,
            changeLearnerMobileNo: changeLearnerMobileNo,
            getNotificationsConfig: getNotificationsConfig,
            getVerificationCode: getVerificationCode,
            updateBank : updateBank,
            getBanksData : getBanksData
        };

        return service;

        function updateLearnerProfile(postData, callback) {
            $http.post(webservices.updatelearnerdetail, postData)
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
            $http.post(webservices.updatelearneralertnotifications, postData)
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

        function changeLearnerPassword(postData, callback) {
            $http.post(webservices.updatelearnerpassword, postData)
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

        function changeLearnerEmail(postData, callback) {
            $http.post(webservices.updatelearneremail, postData)
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

        function changeLearnerMobileNo(postData, callback) {
            $http.post(webservices.updatelearnermobile, postData)
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

        function getNotificationsConfig(postData,callback) {
            var serviceUrl = webservices.getlearnernotificationsconfig + '/' + postData;
            
            $http.get(serviceUrl)
                    .success(function (response) {
                        if (response.status === 200) {
                            callback(response.data);
                        }

                    })
                    .error(function () {
                        callback(false);
                    });
        }
        
        function getVerificationCode(postData, callback) {
            $http.post(webservices.verifylearnermobile, postData)
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
            $http.post(webservices.updatelearnerbankingdetails, postData)
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
        
    }

})();