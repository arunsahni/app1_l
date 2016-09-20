(function () {
    'use strict';

    angular
            .module('tutor-app')
            .factory('StepService', StepService);

    StepService.$inject = ['$http','$localStorage','$state'];
    function StepService($http, $localStorage, $state) {

        var service = {
            getVerificationCode : getVerificationCode,
            saveSteps : saveSteps,
            savePassport : savePassport,
            checkVerificationCode : checkVerificationCode,
            resendVerificationCode : resendVerificationCode,
            saveRefundPolicy : saveRefundPolicy,
            savePayoutFrequency : savePayoutFrequency,
            getLocationsData : getLocationsData,
            getSubjectsData : getSubjectsData,
            getBanksData : getBanksData,
            removeAcademic : removeAcademic,
            removeOtherDocs : removeOtherDocs,
            saveSubjects : saveSubjects,
            removeSupportDocs :removeSupportDocs,
            getInstitutionsData : getInstitutionsData
        };

        return service;
        
        function getVerificationCode(postData,callback){
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
        
        function saveSteps(postData,callback){
            $http.post(webservices.saveSteps,postData)
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
        
        function savePassport(postData, callback) {
            $http.post(webservices.updatetutordetail, postData)
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
        
        function checkVerificationCode(postData, callback) {
            $http.post(webservices.updatetutormobile, postData)
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
        
        function resendVerificationCode(postData, callback) {
            $http.post(webservices.resendverificationcode, postData)
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
        
        /*
         * @desc updates refund policy for tutor.
         */
        function saveRefundPolicy(postData, callback) {
            $http.post(webservices.updatetutordetail, postData)
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

        /*
         * @desc updates payout frequency for tutor.
         */
        function savePayoutFrequency(postData, callback) {
            $http.post(webservices.updatetutordetail, postData)
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
        
        /*
         * @desc - get locations data
         */
        function getLocationsData(callback) {
            $http.get(webservices.getlocationsdata)
                    .success(function (result) {
                        if (result.status === 200) {
                            callback(result.data);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function () {
                        callback(false);
                    });
        }

        /*
         * @desc - get subjects data
         */
        function getSubjectsData(callback) {
            $http.get(webservices.getsubjectsdata)
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

        function removeAcademic(postData,callback){
            $http.post(webservices.removeAcademics, postData)
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


        function removeOtherDocs(postData, callback) {
            $http.post(webservices.removeOtherDocs, postData)
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

        function removeSupportDocs(postData, callback) {
            $http.post(webservices.removeSupportDocs, postData)
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

        function saveSubjects(postData, callback) {
            $http.post(webservices.updatetutorsubjects, postData)
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

        function getInstitutionsData(callback) {
            $http.get(webservices.getinstitutionsdata)
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