(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('announcementsService', announcementsService);

    announcementsService.$inject = ['$http','$q'];
    function announcementsService($http,$q) {

        var service = {
            getAnnouncements: getAnnouncements,
            getCountAnnouncements: getCountAnnouncements,
            getAnnouncement: getAnnouncement,
            addAnnouncement: addAnnouncement,
            editAnnouncement: editAnnouncement,
            removeAnnouncement: removeAnnouncement,
            deleteImageAnnouncement: deleteImageAnnouncement
            
        };

        return service;

        function getAnnouncements(postData ,callback) {
            $http.post(webservices.getAnnouncements, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountAnnouncements(callback) {
            $q.all(
            [
                $http.post(webservices.getAnnouncements),
                $http.get(webservices.countAnnouncements),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addAnnouncement(postData,callback) {
            
            $http.post(webservices.addAnnouncement, postData)
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
        function getAnnouncement(postData,callback) {
            var serviceUrl = webservices.viewAnnouncement +'/' + postData;
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
        
          
        function editAnnouncement(postData,callback) {
            
            $http.post(webservices.editAnnouncement, postData)
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
        function removeAnnouncement(postData,callback) {
           
            var serviceUrl = webservices.removeAnnouncement +'/' + postData.id;
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
        
        function deleteImageAnnouncement(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            })
        }
        ;

    }

})();


