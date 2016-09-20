(function () {
    'use strict';

    angular
            .module('la-app')
            .controller('HomeController', HomeController);

    HomeController.$inject = ['$auth', '$state','$http','$localStorage','AuthService','verifyEmail','$uibModal','$timeout'];

    function HomeController($auth, $state, $http, $localStorage, AuthService,verifyEmail,$uibModal,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.titles = titles;
        vm.init = init;
        vm.winmnainhyt = winmnainhyt;
        vm.register = register;
        vm.authenticate = authenticate;
        vm.fastsignuptutor = fastsignuptutor;
        vm.fastsignuplearner = fastsignuplearner;
        vm.user = {type: "learner"};
        vm.loginlearner = loginlearner;
        vm.fastSignup = {};
        vm.status = {};
        vm.openmodal = openmodal;
        vm.modalopen = modalopen;
        vm.whichmodalopen = whichmodalopen;
        vm.registerForm = {};
        vm.getLowerTitle = getLowerTitle;
        vm.getUpperTitle = getUpperTitle;
        vm.lowerForm = {};
        vm.upperForm = {};
        if(verifyEmail) {
            vm.activationMessage = verifyEmail.data.message;
        }
        vm.lowerFastSignUp = lowerFastSignUp;
        vm.upperFastSignUp = upperFastSignUp;
        
        init();

        // Initialisation
        function init() {
            angular.element(document).ready(function () {
                winmnainhyt();
                window.asd = $('.SlectBox').SumoSelect();
                $('#lowerTitle').SumoSelect();
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
                        vm.user = {type:vm.user.type};
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
                        vm.user = {type:"tutor"};
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
            .then(function(response) {
                if(response.data.status === 200){
                    $localStorage.currentUser = {token: response.data.token, type: response.data.type, id: response.data.data._id, email: response.data.data.email, info: response.data.data.personalInfo};
                    $localStorage.loginstatus = true;
                    
                    $http.defaults.headers.common.Authorization = 'JWT ' + response.token;
                    $state.go('learner.home');
                } else {
                   
                }
            });
        }

        function fastsignuptutor() {
            AuthService.registerTutor(vm.user);
        }

        function fastsignuplearner() {
            console.log(vm.user);
            return false;
            AuthService.registerLearner(vm.user);
        }
        
        function loginlearner() {
            AuthService.loginLearner(vm.user, function (result) {
                if (result === true) {
                    $state.go('learner.home');
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                }
            });
        }
        
        function openmodal() {
            $localStorage.learnermodalcheck = {type:1};
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
        
        function getLowerTitle(){
            vm.user.title = $('#lowerTitle option:selected').val();
            console.log(vm.user);
        }

        function getUpperTitle(){
            vm.user.title = $('#upperTitle option:selected').val();
            console.log(vm.user);
        }
        
        function lowerFastSignUp() {
            console.log(vm.user);
            return false;
            AuthService.registerLearner(vm.user);
        }
        
        function upperFastSignUp() {
            console.log(vm.user);
            return false;
            AuthService.registerLearner(vm.user);
        }

    }

})();

(function () {
    'use strict';
    angular
            .module('la-app')
            .controller('HomeModalInstanceController', HomeModalInstanceController);

    HomeModalInstanceController.$inject = ['$uibModalInstance', '$state', 'AuthService', '$localStorage', '$auth','$http'];

    // Please note that $uibModalInstance represents a modal window (instance) dependency.
    function HomeModalInstanceController($uibModalInstance,$state,AuthService,$localStorage,$auth,$http) {
        var $ctrl = this;
        $ctrl.error = "";
        $ctrl.user = {};
        $ctrl.loginlearner = loginlearner;
        $ctrl.newuserlogin = newuserlogin;
        $ctrl.register = register;
        $ctrl.fastsignuplearner = fastsignuplearner;
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
