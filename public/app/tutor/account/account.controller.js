(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('AccountController', AccountController);
    AccountController.$inject = ['$auth', '$state', '$timeout', 'AuthService', 'DashboardService', '$localStorage', 'AccountService','Upload','StepService'];
    function AccountController($auth, $state, $timeout, AuthService, DashboardService, $localStorage, AccountService, Upload, StepService) {
        var vm = this;
        vm.init = init;
        vm.loadingdoc = loadingdoc;
        vm.getTutorDetail = getTutorDetail;
        vm.tutor = {};
        vm.logout = logout;
        vm.updateProfile = updateProfile;
        vm.imagePaths = imagePaths;
        vm.titles = titles;
        vm.uploadFiles = uploadFiles;
        vm.changePassword = changePassword;
        vm.changeEmail = changeEmail;
        vm.changeMobileNo = changeMobileNo;
        vm.sendCode = sendCode;
        vm.getNotificationsConfig = getNotificationsConfig;
        vm.status = {};
        vm.closeAlert = closeAlert;
        vm.alertNotifications = alertNotifications;
        vm.updateBank = updateBank;
        vm.updatePersonality = updatePersonality;
        vm.updateDescription = updateDescription;
        vm.scrolltoTabs = scrolltoTabs;
        vm.getBanksData = getBanksData;
        //plugin configurations
        vm.titleConfig = {maxItems: 1, labelField: 'name', valueField: 'value', searchField: ['name']};
        vm.accountType = accountType;
        vm.accountTypeConfig = {maxItems: 1, labelField: 'name', valueField: 'value', searchField: ['name']};
        vm.banksConfig = {maxItems: 1, labelField: 'bank', valueField: 'bank', searchField: ['bank']};
        
        init();
        // Initialisation
        function init() {
            //loadingdoc();
            vm.getTutorDetail();
            vm.scrolltoTabs(); 
            if ($state.current.name === 'tutor.account.notifications') {
                getNotificationsConfig();
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
        function getTutorDetail() {
            if ($localStorage.currentTutor.id) {
                var tutorid = {id: $localStorage.currentTutor.id};
                DashboardService.getTutorDetails(tutorid, function (result) {
                    vm.tutor = result;
                    //$('.SlectBox').SumoSelect();
                    window.asd = $('.SlectBox').SumoSelect();
                });
            }
        }

        function logout() {
            AuthService.logoutTutor();
        }

        function updateProfile() {
            var details = {_id: vm.tutor._id, personalInfo: vm.tutor.personalInfo};
            AccountService.updateTutorProfile(details, function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"personal"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"personal"};
                }
            });
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
                        console.log(response);
                        file.result = response.data;
                        vm.tutor.personalInfo.profileImg = response.data.data;
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

        function changePassword() {
            vm.status = {};
            var details = {_id: vm.tutor._id, password: vm.tutor.oldpassword, newpassword: vm.tutor.newpassword};
            AccountService.changeTutorPassword(details, function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Password updated successfully.", type:"password"};
                } else if(result === 'notmatch'){
                    vm.status = {class: 'alert alert-danger fade in', message: "Please enter correct old password.", type:"password"};
                    
                }
                else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"password"};
                }
            });
        }


         function changeEmail() {
            var details = {_id: vm.tutor._id, newemail: vm.tutor.newemail, email: vm.tutor.email};
            AccountService.changeTutorEmail(details, function (result) {
                if (result === true) {
                    //vm.tutor.email = vm.tutor.newemail;
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Email updated successfully. Need to verify it before updating with old one", type:"email"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"email"};
                }
            });
        }
        
        function changeMobileNo() {
            if(vm.tutor.newmobileno){
                var details = {_id: vm.tutor._id, newmobileno: vm.tutor.newmobileno, mobileno: vm.tutor.personalInfo.mobileNo};
                AccountService.getVerificationCode(details, function (result) {
                    if (result === true) {
                        vm.tutor.personalInfo.mobileNo = vm.tutor.newmobileno;
                        details = {};
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Please enter verification code.", type: "mobile"};
                    } else {
                        vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type: "mobile"};
                    }
                });
            }
        }
        
        function sendCode() {
            if(vm.tutor.code === undefined){
                console.log("Inn");
                vm.status = {class: 'alert alert-danger fade in', message: "Verification token not verified.", type: "mobile"};
            }
           
            else if(vm.tutor.code != ""  || vm.tutor.code != undefined  ) {
                console.log("In else");
                var details = {_id: vm.tutor._id, verificationCode: vm.tutor.code};
                AccountService.changeTutorMobileNo(details, function (result) {
                    if (result === true) {
                        details = {};
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Mobile No. updated successfully.", type: "mobile"};
                    } else {
                        vm.status = {class: 'alert alert-danger fade in', message: "Verification token not verified.", type: "mobile"};
                    }
                }); 
            } else {
                vm.status = {class: 'alert alert-danger fade in', message: "Verification token not verified.", type: "mobile"};
            }
            
        }
        
        function closeAlert() {
            vm.status = {};
        }

        function getNotificationsConfig() {
            var userId = $localStorage.currentTutor.id;
            AccountService.getNotificationsConfig(userId,function (result) {
                vm.alert = result;
            });
        }
        
        function closeAlert() {
            vm.status = {};
        }
        
        function alertNotifications() {
            var details = {userId : $localStorage.currentTutor.id,modal:vm.alert};
            AccountService.updateAlertNotifications(details,function (result) {
                
            });
        }
        
        function updateBank() {
            var details = {_id: vm.tutor._id, bankingDetails : vm.tutor.bank};
            AccountService.updateBank(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"bank"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"bank"};
                }
            });
        }
        
        function updatePersonality(){
            var details = {_id: vm.tutor._id, personalityTraits : vm.tutor.personalityTraits};
            AccountService.updateTutorProfile(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"personality"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"personality"};
                }
            });
        }
        
        function updateDescription(){
            var details = {_id: vm.tutor._id, description : vm.tutor.description};
            AccountService.updateTutorProfile(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"personality"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"personality"};
                }
            });
        }
        
        function scrolltoTabs(){
            $('html, body').animate({
                scrollTop: $("#navbardash").offset().top
            }, 1000);
        }
        
        function getBanksData(){
            AccountService.getBanksData(function (result) {
                vm.banks = result;
            });
        }
        
    }

})();