(function () {
    'use strict';

    angular
            .module('tutor-app')
            .controller('ModalInstanceController', ModalInstanceController)
            ;

    ModalInstanceController.$inject = ['$uibModalInstance','$state','AuthService','$localStorage'];
    
    // Please note that $uibModalInstance represents a modal window (instance) dependency.
    function ModalInstanceController($uibModalInstance,$state,AuthService,$localStorage) {
        console.log($uibModalInstance);
        console.log($state);
        alert(1);
        var $ctrl = this;
        $ctrl.error = "";
        $ctrl.user = {};
        $ctrl.logintutor = logintutor;
        $ctrl.newuserlogin = newuserlogin;
        $ctrl.last = $localStorage.currentTutor;
        if($localStorage.currentTutor) {
            $ctrl.user = {email: $ctrl.last.email, firstname: $ctrl.last.info.firstname}
        }
        console.log($ctrl);
        /*
         * @desc login
         */
        function logintutor() {
            console.log($ctrl.user);
            AuthService.loginTutor($ctrl.user,function(result){
                if (result === true) {
                    $uibModalInstance.close();
                    $state.go('tutor.home');
                } else {
                    $ctrl.error = 'Username or password is incorrect';
                    //vm.loading = false;
                }
            });
        }
        
        function newuserlogin() {
            delete $localStorage.currentTutor;
            $ctrl.last = {};
            
        }
        

    }

})();  