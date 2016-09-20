(function () {
    'use strict';

    angular
            .module('tutor-app')
            .controller('HomeController', HomeController);

    HomeController.$inject = ['$auth', '$state', '$http', '$localStorage', 'AuthService', 'verifyEmail', '$uibModal', '$timeout'];

    function HomeController($auth, $state, $http, $localStorage, AuthService, verifyEmail, $uibModal, $timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.winmnainhyt = winmnainhyt;
        vm.register = register;
        vm.authenticate = authenticate;
        vm.fastsignuptutor = fastsignuptutor;
        vm.fastsignuplearner = fastsignuplearner;
        vm.logintutor = logintutor;
        vm.user = {type: "tutor"};
        vm.status = {};
        vm.registerForm = {};
        vm.openmodal = openmodal;
        vm.modalopen = modalopen;
        vm.whichmodalopen = whichmodalopen;
        if (verifyEmail) {
            vm.activationMessage = verifyEmail.data.message;
        }
        init();

        // Initialisation
        function init() {
            angular.element(document).ready(function () {
                winmnainhyt();
                window.asd = $('.SlectBox').SumoSelect();
            });
            angular.element(window).resize(function () {
                winmnainhyt();
            });
        }

        function winmnainhyt() {
            var winhyt = $(window).height();
            var subhyt = winhyt - 84;
            $(".slidebannr .item").css("min-height", subhyt);
        }

        function register() {
            if (vm.user.type === 'learner' || vm.user.type === 'parent') {
                AuthService.registerLearner(vm.user, function (result) {
                    if (result === true) {
                        vm.user = {type: vm.user.type};
                        vm.registerForm.$setPristine();
                        vm.registerForm.$setUntouched();
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                    } else {
                        vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                    }

                });

            } else if (vm.user.type === 'tutor') {
                AuthService.registerTutor(vm.user, function (result) {
                    if (result === true) {
                        vm.user = {type: "tutor"};
                        vm.registerForm.$setPristine();
                        vm.registerForm.$setUntouched();
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                    } else {
                        vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                    }
                });
            }
        }

        function authenticate(provider) {
            $auth.authenticate(provider)
                    .then(function (response) {
                        if (response.data.status === 200) {
                            $localStorage.currentTutor = {token: response.data.token, type: response.data.type, id: response.data.data._id, email: response.data.data.email, info: response.data.data.personalInfo};
                            $localStorage.tutorstatus = true;

                            $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                            $state.go('tutor.home');
                        } else {

                        }
                    });
        }

        function fastsignuptutor() {
            AuthService.registerTutor(vm.user);
        }

        function fastsignuplearner() {
            AuthService.registerLearner(vm.user);
        }

        function logintutor() {
            AuthService.loginTutor(vm.user, function (result) {
                if (result === true) {
                    $state.go('tutor.home');
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                }
            }
            );
        }

        function openmodal() {
            $localStorage.tutormodalcheck = {type: 1};
            whichmodalopen();
        }

        function modalopen(template, windowClass, size) {
            var timer = $timeout(function () {
                var modalInstance = $uibModal.open({
                    animation: vm.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/app/layout/dialogs/' + template,
                    size: size,
                    controller: 'HomeModalInstanceController',
                    controllerAs: '$ctrl',
                    windowClass: windowClass
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

        function whichmodalopen() {
            if ($localStorage.tutormodalcheck) {
                if ($localStorage.tutormodalcheck.type === 1) {
                    modalopen('tutorlogin.html', 'md-modal', 'md');
                }
            }
        }
    }
})();

(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('HomeModalInstanceController', HomeModalInstanceController);

    HomeModalInstanceController.$inject = ['$uibModalInstance', '$state', 'AuthService', '$localStorage', '$auth', '$http'];

    // Please note that $uibModalInstance represents a modal window (instance) dependency.
    function HomeModalInstanceController($uibModalInstance, $state, AuthService, $localStorage, $auth, $http) {
        var $ctrl = this;
        $ctrl.error = "";
        $ctrl.user = {};
        $ctrl.logintutor = logintutor;
        $ctrl.newuserlogin = newuserlogin;
        $ctrl.register = register;
        $ctrl.fastsignuptutor = fastsignuptutor;
        $ctrl.last = $localStorage.currentTutor;
        $ctrl.authenticate = authenticate;
        if ($localStorage.currentTutor) {
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
        function logintutor() {
            AuthService.loginTutor($ctrl.user, function (result) {
                if (result === true) {
                    $uibModalInstance.close();
                    $state.go('tutor.home');
                } else {
                    $ctrl.status = {class: 'alert alert-danger fade in', message: "Either email or password is incorrect."};
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
                    .then(function (response) {
                        if (response.data.status === 200) {
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
 