(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('locationsService', locationsService);

    locationsService.$inject = ['$http','$q'];
    function locationsService($http,$q) {

        var service = {
            getLocations: getLocations,
            getCountLocations: getCountLocations,
            getLocation: getLocation,
            addLocation: addLocation,
            editLocation: editLocation,
            removeLocation: removeLocation,
            deleteImageLocation: deleteImageLocation
            
        };

        return service;

        function getLocations(postData ,callback) {
            $http.post(webservices.getLocations, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountLocations(callback) {
            $q.all(
            [
                $http.post(webservices.getLocations),
                $http.get(webservices.countLocations),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addLocation(postData,callback) {
            
            $http.post(webservices.addLocation, postData)
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
        function getLocation(postData,callback) {
            var serviceUrl = webservices.viewLocation +'/' + postData;
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
        
          
        function editLocation(postData,callback) {
            
            $http.post(webservices.editLocation, postData)
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
        function removeLocation(postData,callback) {
           console.log(postData);
            var serviceUrl = webservices.removeLocation +'/' + postData._id;
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
        
        function deleteImageLocation(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


