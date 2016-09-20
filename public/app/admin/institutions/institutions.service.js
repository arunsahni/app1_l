(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('InstitutionService', InstitutionService);

    InstitutionService.$inject = ['$http','$q'];
    function InstitutionService($http,$q) {

        var service = {
            getInstitutions: getInstitutions,
            getCountInstitutions: getCountInstitutions,
            getInstitution: getInstitution,
            addInstitution: addInstitution,
            editInstitution: editInstitution,
            removeInstitution: removeInstitution,
            deleteImageInstitutions: deleteImageInstitutions
            
        };

        return service;

        function getInstitutions(postData,callback) {
            $http.post(webservices.getInstitutions, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountInstitutions(callback) {
            $q.all(
            [
                $http.post(webservices.getInstitutions),
                $http.get(webservices.countInstitutions),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addInstitution(postData,callback) {
            
            $http.post(webservices.addInstitution, postData)
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
        function getInstitution(postData,callback) {
            var serviceUrl = webservices.viewInstitution +'/' + postData;
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
        
          
        function editInstitution(postData,callback) {
            
            $http.post(webservices.editInstitution, postData)
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
        function removeInstitution(postData,callback) {
            var serviceUrl = webservices.removeInstitution +'/' + postData.id;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.success === 200) {
                            callback(true);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        
        function deleteImageInstitutions(jsonString,callback) {
            var httpObj = $http.post('/institutions/deleteImage-institutions/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            })
        }
        ;

    }

})();


