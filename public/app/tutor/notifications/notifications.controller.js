(function () {
    'use strict';

    angular
            .module('tutor-app')
            .controller('NotificationController', NotificationController)
            ;

    NotificationController.$inject = ['$localStorage', '$window', 'NotificationService'];


    function NotificationController($localStorage, $window, NotificationService) {

        var vm = this;
        vm.init = init;
        vm.config = {autoHideScrollbar: true, theme: "rounded"};
        vm.usernotifications = usernotifications;
        vm.notifications = [];


        init();

        // Initialisation
        function init() {
            loadingdoc();
            usernotifications();
        }

        //
        function loadingdoc() {

            angular.element(window).load(function () {
                $(".notify-list-bx").mCustomScrollbar({
                    autoHideScrollbar: true,
                    theme: "rounded"
                });
            });
        }

        // 
        function usernotifications() {
            if ($localStorage.currentTutor && $localStorage.tutorstatus) {
                if ($localStorage.currentTutor.id) {
                    var userId = $localStorage.currentTutor.id;
                    NotificationService.getNotifications(userId, function (result) {
                        vm.notifications.push(result);
                    });
                }
            }
        }

    }

})();