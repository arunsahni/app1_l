(function () {
    'use strict';

    angular
            .module('tutor-app')
            .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['$http','$localStorage','$state'];
    function NotificationService($http, $localStorage, $state) {

        var service = {
            getNotifications: getNotifications,
        };

        return service;

        //
        function getNotifications(postData,callback) {
            var serviceUrl = webservices.getNotifications + '/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {
                        callback(response.data);
                    })
                    .error(function (data) {
                        //callback(data);
                    });
        }
        

    }

})();