(function () {
    'use strict';

    angular
            .module('la-app')
            .controller('AccountController', AccountController);

    AccountController.$inject = ['$state', '$timeout', 'AuthService', 'DashboardService', '$localStorage','Upload','AccountService'];
    

    function AccountController($state, $timeout, AuthService, DashboardService, $localStorage,Upload,AccountService) {

        var vm = this;
        vm.init = init;
        vm.loadingdoc = loadingdoc;
        vm.getLearnerDetail = getLearnerDetail;
        vm.logout = logout;
        vm.learner = {};
        vm.imagePaths = imagePaths;
        vm.uploadFiles = uploadFiles;
        vm.titles = titles;
        vm.updateProfile = updateProfile;
        vm.changePassword = changePassword;
        vm.changeEmail = changeEmail;
        vm.changeMobileNo = changeMobileNo;
        vm.sendCode = sendCode;
        vm.getNotificationsConfig = getNotificationsConfig;
        vm.status = {};
        vm.closeAlert = closeAlert;
        vm.alertNotifications = alertNotifications;
        vm.updateBank = updateBank;
        vm.scrolltoTabs = scrolltoTabs;
        vm.getBanksData = getBanksData;
        // plugin configuration 
        vm.titleConfig = {maxItems: 1, labelField: 'name', valueField: 'value', searchField: ['name']};
        vm.accountType = accountType;
        vm.accountTypeConfig = {maxItems: 1, labelField: 'name', valueField: 'value', searchField: ['name']};
        vm.banksConfig = {maxItems: 1, labelField: 'bank', valueField: 'bank', searchField: ['bank']};
        vm.announcementsConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.announcements = [{value:'All Alerts',name:'All Alerts'},{value:'None', name:'None'}];
        
        vm.myWalletConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.myWallet = [{value:'All transactions',name:'All transactions'},{value:'None', name:'None'}];
        
        vm.calendarNotificationsConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.calendarNotifications = [{value:'1 day before',name:'1 day before'},{value:'2 days before',name:'2 days before'},{value:'3 days before',name:'3 days before'},{value:'2 hrs before', name:'2 hrs before'},{value:'None', name:'None'}];
       
        vm.interviewRequestsConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.interviewRequests = [{value:'All Alerts',name:'All Alerts'},{value:'None', name:'None'}];
     
       
        vm.lessonRemindersConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.lessonReminders = [{value:'None', name:'None'}];
        
        vm.popularPicksConfig = {maxItems: 1, labelField: 'value', valueField: 'name', searchField: ['name']};
        vm.popularPicks = [{value:'None', name:'None'}];
        init();
        
        // Initialisation
        function init() {
            //loadingdoc();
            vm.getLearnerDetail();
            vm.scrolltoTabs();
            if ($state.current.name === 'learner.account.notifications') {
                getNotificationsConfig();
                $('select.SlectBox')[0].sumo.reload();
            }
            vm.getBanksData();
        }
        
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();
            });
        }
        
         /*
         * 
         */
        function getLearnerDetail() {
            if ($localStorage.currentUser.id) {
                var learnerid = {id: $localStorage.currentUser.id};
                DashboardService.getLearnerDetails(learnerid, function (result) {
                    vm.learner = result;
                    window.asd = $('.SlectBox').SumoSelect();
                });
            }
        }
        
        function logout() {
            AuthService.logoutLearner();
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
                    file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                });
            }

        }
        
        function updateProfile() {
            var details = {_id: vm.learner._id, personalInfo: vm.learner.personalInfo};
            AccountService.updateLearnerProfile(details, function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"personal"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"personal"};
                }
            });
        }        
        
        function changePassword() {
            vm.status = {};
            var details = {_id: vm.learner._id, password: vm.learner.oldpassword, newpassword: vm.learner.newpassword};
            AccountService.changeLearnerPassword(details, function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Password updated successfully.", type:"password"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"password"};
                }
            });
        }

        function changeEmail() {
            var details = {_id: vm.learner._id, newemail: vm.learner.newemail, email: vm.learner.email};
            AccountService.changeLearnerEmail(details, function (result) {
                if (result === true) {
                    vm.learner.email = vm.learner.newemail;
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Email updated successfully.", type:"email"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"email"};
                }
            });
        }

        function changeMobileNo() {
            var details = {_id: vm.learner._id, newmobileno: vm.learner.newmobileno, mobileno: vm.learner.personalInfo.mobileNo};
            AccountService.changeLearnerMobileNo(details, function (result) {
                if (result === true) {
                    vm.learner.personalInfo.mobileNo = vm.learner.newmobileno;
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Please enter verification code.", type: "mobile"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type: "mobile"};
                }
            });
        }

        function sendCode() {
            var details = {_id:vm.learner._id,verificationCode:vm.learner.code};
            AccountService.getVerificationCode(details, function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Mobile No. updated successfully.", type: "mobile"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Verification token not verified.", type: "mobile"};
                }
            });
        }
        
        function getNotificationsConfig() {
            var userId = $localStorage.currentUser.id;
            AccountService.getNotificationsConfig(userId,function (result) {
                vm.alert = result;
            });
        }
        
        function closeAlert() {
            vm.status = {};
        }
        
        function alertNotifications() {
            var details = {userId : $localStorage.currentUser.id,modal:vm.alert};
            console.log(details);
            AccountService.updateAlertNotifications(details,function (result) {
                
            });
        }
                
        function updateBank() {
            var details = {_id: vm.learner._id, bankingDetails : vm.learner.bank};
            AccountService.updateBank(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"bank"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"bank"};
                }
            });
        }
        
        function scrolltoTabs(){
            $('html, body').animate({
                scrollTop: $("#navbardash").offset().top
            }, 1000);
        }
        
        function getBanksData() {
            AccountService.getBanksData(function (result) {
                vm.banks = result;
            });
        }
        
    }

})();  