(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('AuthService', AuthService);

    AuthService.$inject = ['$http','$localStorage','$state'];
    function AuthService($http, $localStorage, $state) {

        var service = {
            loginStaff: loginStaff,
            logoutStaff : logoutStaff
        };

        return service;

        function loginStaff(postData, callback) {
            $http.post(webservices.stafflogin, postData)
                    .success(function (response) {
                        if (response.token) {
                            $localStorage.adminUser = {token: response.token,type: response.type, id:response.id};
                            $localStorage.adminstatus = true;
                            $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                            callback(true);
                        } else {
                            callback(false);
                        }
                    })
                    .error(function (data) {

                    });
        };
        
        function logoutStaff() {
            delete $localStorage.adminUser;
            $localStorage.adminstatus = false;
            $http.defaults.headers.common.Authorization = undefined;
            $state.go('anon.login');
        };

    }

})();