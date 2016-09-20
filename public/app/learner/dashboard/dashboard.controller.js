(function () {
    'use strict';

    angular
            .module('la-app')
            .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$auth', '$state', '$uibModal', '$timeout', 'AuthService', 'DashboardService', '$localStorage', 'NotificationService', 'Upload'];


    function DashboardController($auth, $state, $uibModal, $timeout, AuthService, DashboardService, $localStorage, NotificationService, Upload) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.animationsEnabled = true;
        vm.isEnabled = false;
        vm.init = init;
        vm.winmnainhyt = winmnainhyt;
        vm.logout = logout;
        vm.learner = {};
        vm.getLearnerDetail = getLearnerDetail;
        vm.loadingdocs = loadingdocs;
        vm.usernotifications = usernotifications;
        vm.notifications = [];
        vm.dateOptions = {minDate: new Date(), showWeeks: false};
        vm.uploadFiles = uploadFiles;
        vm.imagePaths = imagePaths;
        vm.verifyModal = verifyModal;

        init();

        // Initialisation
        function init() {
            loadingdocs();
            getLearnerDetail();
            usernotifications();
        }

        function winmnainhyt() {
            var winhyt = $(window).height();
            var subhyt = winhyt - 84;
            $(".slidebannr .item").css("min-height", subhyt);
        }

        function logout() {
            AuthService.logoutLearner();
            $auth.removeToken();
        }

        function getLearnerDetail() {
            if ($localStorage.currentUser  && $localStorage.loginstatus) {
                if($localStorage.currentUser.id) {
                    var learnerid = {id: $localStorage.currentUser.id};
                    DashboardService.getLearnerDetails(learnerid, function (result) {
                        vm.learner = result;
                        vm.learner.createdDate = moment(vm.learner.createdDate).format("MMMM YYYY");
                        if (vm.learner.verifyEmail.verificationStatus === false) {
                            verifyModal('verifylearner.html', 'verifymodal');
                        }
                    });    
                } else {
                    AuthService.logoutLearner();
                }
            } else {
                AuthService.logoutLearner();
            }
        }

        function loadingdocs() {
            angular.element(document).ready(function () {
                winmnainhyt();
                window.asd = $('.SlectBox').SumoSelect();
            });

            angular.element(window).resize(function () {
                winmnainhyt();
            });
            
            angular.element(".alertbx a").click(function () {
                console.log('test');
                $(this).parent().hide(100);
            });
            
        }
        


        function usernotifications() {
            if ($localStorage.currentUser) {
                if ($localStorage.currentUser.id) {
                    var userId = $localStorage.currentUser.id;
                    NotificationService.getNotifications(userId, function (result) {
                        if (result.length > 0) {
                            vm.notifications = result;
                        }
                    });
                }
            }
        }

        function uploadFiles(file, errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: webservices.uploadLearnerProfilePic,
                    data: {file: file, _id: vm.learner._id}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        vm.learner.personalInfo.profileImg = response.data.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }

        }
        
        function verifyModal(template, windowClass) {
            var timer = $timeout(function () {
                var modalInstance = $uibModal.open({
                    animation: vm.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/app/layout/dialogs/' + template,
                    controller: 'ModalController',
                    controllerAs: '$ctrl',
                    backdrop: 'static',
                    windowClass: windowClass,
                    keyboard: false,
                    resolve: {
                        emailstatus: function () {
                            return vm.emailverification;
                        }
                    }
                });

            modalInstance.opened.then(function () {
                $timeout.cancel(timer);
            });
            modalInstance.result.then(function () {

            }, function () {

            });
        }, 1000);

        }


    }
})();

(function () {
    'use strict';

    angular
            .module('la-app')
            .controller('ModalController', ModalController);
            ModalController.$inject = ['$uibModalInstance', 'emailstatus','$state'];
            
            function ModalController($uibModalInstance, emailstatus, $state) {
                var $ctrl = this;
                $ctrl.verificationstatus = emailstatus;
                $ctrl.buildprofile = buildprofile;
                
                
                function buildprofile() {
                    $uibModalInstance.close();
                    $state.go('build.step1');
                }
            }

})();
