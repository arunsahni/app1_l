(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['$state', '$timeout', 'AuthService'];

    function AdminController($state, $timeout, AuthService) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.animationsEnabled = true;
        vm.init = init;
        vm.loginstaff = loginstaff;

        init();

        // Initialisation
        function init() {

        }

        function loginstaff() {
            AuthService.loginStaff(vm.user, function (result) {
                if (result === true) {
                    $state.go('admin.dashboard');
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                }
            }
            );
        }


    }

})();
