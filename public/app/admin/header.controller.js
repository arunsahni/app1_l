(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$state', 'AuthService'];

    function HeaderController($state, AuthService) {

        var vm = this;
        vm.init = init;
        vm.logout = logout;

        init();

        // Initialisation
        function init() {

        }

        function logout() {
            AuthService.logoutStaff();
        }


    }

})();
