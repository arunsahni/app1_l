(function () {
    'use strict';

    angular
            .module('tutor-app')
            .controller('HeaderController', HeaderController)
            ;

    HeaderController.$inject = ['$uibModal', '$timeout', '$localStorage', '$window', 'AuthService'];

    function HeaderController($uibModal, $timeout, $localStorage, $window, AuthService) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.animationsEnabled = true;
        vm.init = init;
        vm.modalopen = modalopen;
        vm.whichmodalopen = whichmodalopen;
        vm.modalcheck = modalcheck;
        vm.loadingdoc = loadingdoc;
        vm.getLastRecords = getLastRecords;


        init();

        // Initialisation
        function init() {
            loadingdoc();
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
                        lasttutor: vm.getLastRecords()
                    }
                });

                modalInstance.opened.then(function () {
                    $timeout.cancel(timer);
                    delete $localStorage.tutormodalcheck;
                });
                modalInstance.result.then(function () {
                    if ($localStorage.tutormodalcheck) {
                        vm.whichmodalopen();
                    }
                }, function () {

                });
            }, 1000);
        }

        // 
        function whichmodalopen() {
            if ($localStorage.tutormodalcheck) {
                if ($localStorage.tutormodalcheck.type === 1) {
                    modalopen('tutorlogin.html', 'md-modal', 'md');
                }
                if ($localStorage.tutormodalcheck.type === 2) {
                    modalopen('tutorsignup.html', 'tutormodal', 'lg');
                }
                if ($localStorage.tutormodalcheck.type === 3) {
                    modalopen('tutor.forgotpassword.html', 'md-modal', 'md');
                }
            }
        }

        //
        function modalcheck(e, type) {
            $localStorage.learnermodalcheck = {type: type};
            $window.location('/tutor');
            e.preventDefault();
        }

        //
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();

            });
        }

        function getLastRecords() {
            if ($localStorage.currentTutor) {
                var id = $localStorage.currentTutor.id;
                AuthService.beforeLogin(id, function (result) {
                    return result;
                });
            }
        }
    }


})();

(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('ModalInstanceController', ModalInstanceController);

    ModalInstanceController.$inject = ['$uibModalInstance', '$state', 'AuthService', '$localStorage', '$auth','$http'];

    // Please note that $uibModalInstance represents a modal window (instance) dependency.
    function ModalInstanceController($uibModalInstance, $state, AuthService, $localStorage, $auth, $http) {
        var $ctrl = this;
        $ctrl.user = {};
        $ctrl.logintutor = logintutor;
        $ctrl.newuserlogin = newuserlogin;
        $ctrl.register = register;
        $ctrl.fastsignuptutor = fastsignuptutor;
        $ctrl.last = $localStorage.currentTutor;
        $ctrl.status = {};
        $ctrl.faststatus = {};
        $ctrl.authenticate = authenticate;
        if ($localStorage.currentTutor) {
            $ctrl.user = {email: $ctrl.last.email, firstname: $ctrl.last.info.firstName, lastname: $ctrl.last.info.lastName}
        }
        $ctrl.imagePaths = imagePaths;
        $ctrl.fastsignup = {};
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
        function logintutor() {
            AuthService.loginTutor($ctrl.user, function (result) {
                if (result === true) {
                    $uibModalInstance.close();
                    $state.go('tutor.home');
                } else {
                    $ctrl.status = {class: 'alert alert-danger fade in', message: "Either email or password is incorrect"};
                }
            });
        }

        function newuserlogin(type) {
            delete $localStorage.currentTutor;
            $localStorage.tutormodalcheck = {type: type};
            $ctrl.last = {};
            $ctrl.user = {};
            $uibModalInstance.close();
        }

        function register() {
            $ctrl.user = angular.copy($ctrl.slowuser);
            AuthService.registerTutor($ctrl.user, function (result) {
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

        function fastsignuptutor() {
            $ctrl.user = angular.copy($ctrl.fastuser);
            AuthService.fastSignUp($ctrl.user, function (result) {
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

        function authenticate(provider) {
            $auth.authenticate(provider)
            .then(function(response) {
                if(response.data.status === 200){
                    $uibModalInstance.close();
                    $localStorage.currentTutor = {token: response.data.token, type: response.data.type, id: response.data.data._id, email: response.data.data.email, info: response.data.data.personalInfo};
                    $localStorage.tutorstatus = true;
                    
                    $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                    $state.go('tutor.home');
                } else {
                   
                }
            });
        }
    }

})();
