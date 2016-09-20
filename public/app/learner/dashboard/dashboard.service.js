(function () {
    'use strict';

    angular
            .module('la-app')
            .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$http','$localStorage','$state'];
    function DashboardService($http, $localStorage, $state) {

        var service = {
            getLearnerDetails: getLearnerDetails,
        };

        return service;


        function getLearnerDetails(postData,callback) {
            $http.post(webservices.getlearnerdetail, postData)
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