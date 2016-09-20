(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('specialexpertisesService', specialexpertisesService);

    specialexpertisesService.$inject = ['$http','$q'];
    function specialexpertisesService($http,$q) {

        var service = {
            getSpecialexpertises: getSpecialexpertises,
            getCountSpecialexpertises: getCountSpecialexpertises,
            getSpecialexpertise: getSpecialexpertise,
            addSpecialexpertise: addSpecialexpertise,
            editSpecialexpertise: editSpecialexpertise,
            removeSpecialexpertise: removeSpecialexpertise,
            deleteImageSpecialexpertise: deleteImageSpecialexpertise
            
        };

        return service;

        function getSpecialexpertises(postData ,callback) {
            $http.post(webservices.getSpecialexpertises, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountSpecialexpertises(callback) {
            $q.all(
            [
                $http.post(webservices.getSpecialexpertises),
                $http.get(webservices.countSpecialexpertises),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addSpecialexpertise(postData,callback) {
            console.log("Service",postData)
            $http.post(webservices.addSpecialexpertise, postData)
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
        function getSpecialexpertise(postData,callback) {
            var serviceUrl = webservices.viewSpecialexpertise +'/' + postData;
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
        
          
        function editSpecialexpertise(postData,callback) {
            $http.post(webservices.editSpecialexpertise, postData)
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
        function removeSpecialexpertise(postData,callback) {
           
            var serviceUrl = webservices.removeSpecialexpertise +'/' + postData._id;
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
        
        function deleteImageSpecialexpertise(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


