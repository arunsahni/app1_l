(function () {
    'use strict';

    angular
            .module('la-app')
            .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['$http','$localStorage','$state'];
    function NotificationService($http, $localStorage, $state) {

        var service = {
            getNotifications: getNotifications,
        };

        return service;

        //
        function getNotifications(postData,callback) {
            var serviceUrl = webservices.getLearnerNotifications + '/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response.data);
                        } else {
                            callback(false);
                        }
                        
                    })
                    .error(function (data) {
                        //callback(data);
                    });
        }
        

    }

})();