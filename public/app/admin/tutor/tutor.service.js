(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('adminService', adminService);

    adminService.$inject = ['$http','$q'];
    function adminService($http, $q) {

        var service = {
            getTutors: getTutors,
            getCountTutors: getCountTutors,
            getTutor: getTutor,
            addTutor: addTutor,
            editTutor: editTutor,
            removeTutor: removeTutor,
            manageStatus: manageStatus,
            verifyTutor: verifyTutor
            
        };

        return service;

        function getCountTutors(callback) {
            
            $q.all(
                    [
                        $http.post(webservices.gettutors),
                        $http.get(webservices.countTutors),
                    ]
                    ).then(
                    function (response) {
                        callback(response);
                    },
                    function (error) {
                        console.log(error);
                    });
            
        };
       
        function getTutors(postData,callback) {
            $http.post(webservices.gettutors, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response.data);
                        }
                    })
                    .error(function (data) {
                        //callback(data);
                    });
        };
        
        
        function addTutor(postData,callback) {
            console.log("In service with data: ",postData);
            
            $http.post(webservices.addTutor, postData)
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
        function getTutor(postData,callback) {
            var serviceUrl = webservices.viewTutor +'/' + postData;
            $q.all(
                    [
                        $http.post(webservices.getBadges,{}),
                        $http.get(serviceUrl)
                    ]
                    ).then(
                    function (response) {
                        callback(response);
                    },
                    function (error) {
                        console.log(error);
                    });
        }
        ;
        
          
        function editTutor(postData,callback) {
            
            $http.post(webservices.editTutor, postData)
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
        function removeTutor(postData,callback) {
            
            $http.post(webservices.removeTutor, postData)
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

        function manageStatus(postData,callback){
            console.log("postData",postData);
            $http.post(webservices.accountStatus, postData)
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
        function verifyTutor(postData,callback) {
            console.log("In service with data: ",postData);
            
            $http.post(webservices.verifyTutor, postData)
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


