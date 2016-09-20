(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('subjectService', subjectService);

    subjectService.$inject = ['$http','$q'];
    function subjectService($http,$q) {

        var service = {
            getSubjects: getSubjects,
            getCountSubjects: getCountSubjects,
            getSubject: getSubject,
            addSubject: addSubject,
            editSubject: editSubject,
            removeSubject: removeSubject,
            deleteImageSubject: deleteImageSubject
            
        };

        return service;

        function getSubjects(postData,callback) {
            $http.post(webservices.getSubjects, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountSubjects(callback) {
            $q.all(
            [
                $http.post(webservices.getSubjects),
                $http.get(webservices.countSubjects),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addSubject(postData,callback) {
            
            $http.post(webservices.addSubject, postData)
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
        function getSubject(postData,callback) {
            var serviceUrl = webservices.viewSubject +'/' + postData;
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
        
          
        function editSubject(postData,callback) {
            
            $http.post(webservices.editSubject, postData)
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
        function removeSubject(postData,callback) {
            var serviceUrl = webservices.removeSubject +'/' + postData.id;
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
        
        function deleteImageSubject(jsonString,callback) {
            var httpObj = $http.post('/subject/deleteImage-subject/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            })
        }
        ;

    }

})();


