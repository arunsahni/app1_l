(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('banksService', banksService);

    banksService.$inject = ['$http','$q'];
    function banksService($http,$q) {

        var service = {
            getBanks: getBanks,
            getCountBanks: getCountBanks,
            getBank: getBank,
            addBank: addBank,
            editBank: editBank,
            removeBank: removeBank,
            deleteImageBank: deleteImageBank
            
        };

        return service;

        function getBanks(postData ,callback) {
            $http.post(webservices.getBanks, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountBanks(callback) {
            $q.all(
            [
                $http.post(webservices.getBanks),
                $http.get(webservices.countBanks),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addBank(postData,callback) {
            
            $http.post(webservices.addBank, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        function getBank(postData,callback) {
            var serviceUrl = webservices.viewBank +'/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response.data);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        
          
        function editBank(postData,callback) {
            $http.post(webservices.editBank, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        function removeBank(postData,callback) {
           
            var serviceUrl = webservices.removeBank +'/' + postData.id;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(true);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        
        function deleteImageBank(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


