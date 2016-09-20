(function () {
    'use strict';

    angular
            .module('la-app')
            .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$uibModal','$timeout','$localStorage','$window','AuthService'];
       

    function HeaderController($uibModal,$timeout,$localStorage,$window,AuthService) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.animationsEnabled = true;
        vm.init = init;
        vm.modalopen = modalopen;
        vm.whichmodalopen = whichmodalopen;
        vm.modalcheck = modalcheck;
        vm.getLastRecords = getLastRecords;
        

        init();

        // Initialisation
        function init() {
            whichmodalopen();
        }

        // 
        function modalopen(template, windowClass, size) {
            var timer = $timeout(function () {
                var modalInstance = $uibModal.open({
                    animation: vm.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/app/layout/dialogs/' + template,
                    size: size,
                    controller: 'ModalInstanceController',
                    controllerAs: '$ctrl',
                    windowClass: windowClass,
                    resolve: {
                        //lastlearner: vm.getLastRecords()
                    } 
                });
                
                modalInstance.opened.then(function () {
                    $timeout.cancel(timer);
                    delete $localStorage.learnermodalcheck;
                });
                modalInstance.result.then(function () {
                    if ($localStorage.learnermodalcheck) {
                        vm.whichmodalopen();
                    }
                }, function () {

                });


            }, 1000);
        }
        
        //
        function whichmodalopen(){
            if($localStorage.learnermodalcheck) {
                if($localStorage.learnermodalcheck.type === 1) {
                    modalopen('learnerlogin.html','md-modal','md');
                }
                if($localStorage.learnermodalcheck.type === 2) {
                    modalopen('learnersignup.html','tutormodal learnerModal','lg');
                }
                if($localStorage.learnermodalcheck.type === 3) {
                    modalopen('forgotpassword.html','md-modal','md');
                }
            }
        }
        
        //
        function modalcheck(e,type){
            $localStorage.tutormodalcheck = {type:type};
            $window.location('/');
            e.preventDefault();
        }
        
        function getLastRecords() {
            if ($localStorage.currentUser) {
                var id = $localStorage.currentUser.id;
                AuthService.beforeLogin(id, function (result) {
                    return result;
                });
            }
        }

    }
    
    
    // Please note that $uibModalInstance represents a modal window (instance) dependency.

})();

(function () {
    'use strict';
    angular
            .module('la-app')
            .controller('ModalInstanceController', ModalInstanceController);

    ModalInstanceController.$inject = ['$uibModalInstance', '$state', 'AuthService', '$localStorage', '$auth', '$http'];

    // Please note that $uibModalInstance represents a modal window (instance) dependency.
    function ModalInstanceController($uibModalInstance,$state,AuthService,$localStorage,$auth,$http) {
        var $ctrl = this;
        $ctrl.error = "";
        $ctrl.user = {};
        $ctrl.loginlearner = loginlearner;
        $ctrl.newuserlogin = newuserlogin;
        $ctrl.register = register;
        $ctrl.fastsignuplearner = fastsignuplearner;
        $ctrl.status = {};
        $ctrl.faststatus = {};
        $ctrl.last = $localStorage.currentUser;
        $ctrl.authenticate = authenticate;
        if($localStorage.currentUser) {
            $ctrl.user = {email: $ctrl.last.email, firstname: $ctrl.last.info.firstname};
        }
        $ctrl.imagePaths = imagePaths;
        $ctrl.fastSignup = {};
        $ctrl.slowSignup = {};
        
        $ctrl.forgotuser = {};
        $ctrl.forgotpwd = forgotpwd;
     
        function forgotpwd() {
            AuthService.forgotpwd($ctrl.forgotuser, function (result) {
                if (result === true) {
                    $ctrl.forgotuser = {};
                    $ctrl.status = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                } else {
                    $ctrl.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                }
            });
        }
        
        /*
         * @desc login
         */
        function loginlearner() {
            AuthService.loginLearner($ctrl.user,function(result){
                if (result === true) {
                    $uibModalInstance.close();
                    $state.go('learner.home');
                } else {
                    $ctrl.status = {class: 'alert alert-danger fade in', message: "Either email or password is incorrect."};
                }
            });
        }
        
        function newuserlogin(type) {
            delete $localStorage.currentUser;
            $localStorage.learnermodalcheck = {type: type};
            $ctrl.last = {};
            $ctrl.user = {};
            $uibModalInstance.close();
        }

        function register() {
            $ctrl.user = angular.copy($ctrl.slowuser);
            AuthService.registerLearner($ctrl.user, function (result) {
                if (result === true) {
                    $ctrl.slowuser = {};
                    $ctrl.slowSignup.$setPristine();
                    $ctrl.slowSignup.$setUntouched();
                     
                    $ctrl.status = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                } else {
                    $ctrl.status = {class: 'alert alert-danger fade in', message: result};
                }
            });
        }
        
        function fastsignuplearner(){
            $ctrl.user = angular.copy($ctrl.fastuser);
            AuthService.fastSignUp($ctrl.user, function(result){
                if (result === true) {
                    $ctrl.fastuser = {};
                    $ctrl.fastSignup.$setPristine();
                    $ctrl.fastSignup.$setUntouched();
                    $ctrl.faststatus = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                } else {
                    $ctrl.faststatus = {class: 'alert alert-danger fade in', message: result};
                }
            });
        }
        
        function authenticate(provider){
            $auth.authenticate(provider)
            .then(function(response) {
                if(response.data.status === 200){
                    $uibModalInstance.close();
                    $localStorage.currentUser = {token: response.data.token, type: response.data.type, id: response.data.data._id, email: response.data.data.email, info: response.data.data.personalInfo};
                    $localStorage.loginstatus = true;
                    
                    $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                    $state.go('learner.home');
                } else {
                   
                }
            });
        }
        
        

    }

})();
