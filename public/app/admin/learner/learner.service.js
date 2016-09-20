(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('learnerService', learnerService);

    learnerService.$inject = ['$http','$q'];
    function learnerService($http, $q) {

        var service = {
            getCountLearners: getCountLearners,
            getLearners: getLearners,
            getLearner: getLearner,
            addLearner: addLearner,
            editLearner: editLearner,
            removeLearner: removeLearner,
            manageStatus: manageStatus
        };

        return service;
        
        
        function getCountLearners(callback) {
            
            $q.all(
                    [
                        $http.post(webservices.getLearners),
                        $http.get(webservices.countLearners),
                    ]
                    ).then(
                    function (response) {
                        callback(response);
                    },
                    function (error) {
                        console.log(error);
                    });
            
        };
    
        function getLearners(postData, callback) {
            $http.post(webservices.getLearners, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response.data);
                        }
                    })
                    .error(function (data) {
                        //callback(data);
                    });
        };
        
        
        function addLearner(postData,callback) {
            
            $http.post(webservices.addLearner, postData)
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
        function getLearner(postData,callback) {
            var serviceUrl = webservices.viewLearner +'/' + postData;
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
        
          
        function editLearner(postData,callback) {
            
            $http.post(webservices.editLearner, postData)
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
        function removeLearner(postData,callback) {
            
            $http.post(webservices.removeLearner, postData)
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
        
         function manageStatus(postData,callback) {
            
            $http.post(webservices.manageStatusLearner, postData)
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

    }

})();


