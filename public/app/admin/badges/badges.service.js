(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('badgesService', badgesService);

    badgesService.$inject = ['$http','$q'];
    function badgesService($http,$q) {

        var service = {
            getBadges: getBadges,
            getCountBadges: getCountBadges,
            getBadge: getBadge,
            addBadge: addBadge,
            editBadge: editBadge,
            removeBadge: removeBadge,
            deleteImageBadge: deleteImageBadge
            
        };

        return service;

        function getBadges(postData ,callback) {
            $http.post(webservices.getBadges, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountBadges(callback) {
            $q.all(
            [
                $http.post(webservices.getBadges),
                $http.get(webservices.countBadges),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addBadge(postData,callback) {
            
            $http.post(webservices.addBadge, postData)
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
        function getBadge(postData,callback) {
            var serviceUrl = webservices.viewBadge +'/' + postData;
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
        
          
        function editBadge(postData,callback) {
            
            $http.post(webservices.editBadge, postData)
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
        function removeBadge(postData,callback) {
           
            var serviceUrl = webservices.removeBadge +'/' + postData.id;
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
        
        function deleteImageBadge(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


