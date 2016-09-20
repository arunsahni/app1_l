(function () {
    'use strict';

    angular
            .module('tutor-app')
            .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$http','$localStorage','$state'];
    function DashboardService($http, $localStorage, $state) {

        var service = {
            getTutorDetails: getTutorDetails,
        };

        return service;


        function getTutorDetails(postData,callback) {
            $http.post(webservices.gettutordetail, postData)
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


    }

})();