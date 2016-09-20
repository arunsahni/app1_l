(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$state','$timeout','AuthService'];

    function DashboardController($state, $timeout, AuthService) {
        
        var vm = this;
        vm.isAuthenticated = false;
        vm.animationsEnabled = true;
        vm.init = init;
        vm.supplierData = [
                {"name": "arun","email": "arun@gmail.com","supplierType": "supp","mobile": "9889","status":"active"},
                {"name": "arun","email": "arun@gmail.com","supplierType": "supp","mobile": "9889","status":"active"},
                {"name": "arun","email": "arun@gmail.com","supplierType": "supp","mobile": "9889","status":"active"},
                {"name": "arun","email": "arun@gmail.com","supplierType": "supp","mobile": "9889","status":"active"}
            ];
        init();
        
        // Initialisation
        function init() {
           
            console.log("Hi i m dasboard");
        }


    }

})();

  