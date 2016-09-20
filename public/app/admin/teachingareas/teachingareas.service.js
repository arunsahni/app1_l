(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('specialisedareasService', specialisedareasService);

    specialisedareasService.$inject = ['$http','$q'];
    function specialisedareasService($http,$q) {

        var service = {
            getSpecialisedareas: getSpecialisedareas,
            getCountSpecialisedareas: getCountSpecialisedareas,
            getSpecialisedarea: getSpecialisedarea,
            addSpecialisedarea: addSpecialisedarea,
            editSpecialisedarea: editSpecialisedarea,
            removeSpecialisedarea: removeSpecialisedarea,
            deleteImageSpecialisedarea: deleteImageSpecialisedarea
            
        };

        return service;

        function getSpecialisedareas(postData ,callback) {
            $http.post(webservices.getSpecialisedareas, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountSpecialisedareas(callback) {
            $q.all(
            [
                $http.post(webservices.getSpecialisedareas),
                $http.get(webservices.countSpecialisedareas),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addSpecialisedarea(postData,callback) {
            
            $http.post(webservices.addSpecialisedarea, postData)
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
        function getSpecialisedarea(postData,callback) {
            var serviceUrl = webservices.viewSpecialisedarea +'/' + postData;
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
        
          
        function editSpecialisedarea(postData,callback) {
            $http.post(webservices.editSpecialisedarea, postData)
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
        function removeSpecialisedarea(postData,callback) {
           
            var serviceUrl = webservices.removeSpecialisedarea +'/' + postData._id;
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
        
        function deleteImageSpecialisedarea(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


