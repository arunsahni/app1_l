(function () {
    'use strict';

    angular
            .module('tutor-app')
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
        vm.tutor = {};
        vm.verifyModal = verifyModal;
        vm.getTutorDetail = getTutorDetail;
        vm.loadingdocs = loadingdocs;
        vm.usernotifications = usernotifications;
        vm.notifications = [];
        vm.dateOptions = {minDate: new Date(), showWeeks: false};
        vm.uploadFiles = uploadFiles;
        vm.imagePaths = imagePaths;
        init();

        // Initialisation
        function init() {
            loadingdocs();
            getTutorDetail();
            usernotifications();
        }

        function winmnainhyt() {
            var winhyt = $(window).height();
            var subhyt = winhyt - 84;
            $(".slidebannr .item").css("min-height", subhyt);
        }

        function logout() {
            AuthService.logoutTutor();
            $auth.removeToken();
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
                    keyboard : false,
                    resolve: {
                        emailstatus: function () {
                            return vm.emailverification;
                        },
                        buildstage: function() {
                            return vm.buildstage;
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

        /*
         * 
         */
        function getTutorDetail() {
            if ($localStorage.currentTutor) {
                var tutorid = {id: $localStorage.currentTutor.id};
                DashboardService.getTutorDetails(tutorid, function (result) {
                    vm.tutor = result;
                    vm.isEnabled = vm.tutor.isEnabled;
                    vm.emailverification = vm.tutor.verifyEmail.verificationStatus;
                    vm.buildstage = vm.tutor.buildstage;
                    if (vm.isEnabled === false) {
                        verifyModal('verifytutor.html', 'verifymodal');
                    }
                });
            } else {
                AuthService.logoutTutor();
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
                $(this).parent().hide(100);
            });
        }

        function usernotifications() {
            if ($localStorage.currentTutor) {
                if ($localStorage.currentTutor.id) {
                    var userId = $localStorage.currentTutor.id;
                    NotificationService.getNotifications(userId, function (result) {
                        vm.notifications.push(result);
                    });
                }
            }
        }

        function uploadFiles(file, errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: webservices.uploadProfilePic,
                    data: {file: file, _id: vm.tutor._id}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        vm.tutor.personalInfo.profileImg = response.data.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }

        }

    }
})();

(function () {
    'use strict';

    angular
            .module('tutor-app')
            .controller('ModalController', ModalController);
            ModalController.$inject = ['$uibModalInstance', 'emailstatus','$state', 'buildstage'];
            
            function ModalController($uibModalInstance, emailstatus, $state,buildstage) {
                var $ctrl = this;
                $ctrl.verificationstatus = emailstatus;
                $ctrl.buildprofile = buildprofile;
                $ctrl.buildstage = buildstage;
                function buildprofile() {
                    $uibModalInstance.close();
                    $state.go('build.'+$ctrl.buildstage);
                }
            }

})();