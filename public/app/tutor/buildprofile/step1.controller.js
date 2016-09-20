(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('StepOneController', StepOneController)
            ;
    StepOneController.$inject = ['$state', 'StepService', '$localStorage', 'DashboardService','Upload','$timeout'];

    function StepOneController($state, StepService, $localStorage, DashboardService, Upload, $timeout) {
        var vm = this;
        vm.init = init;
        vm.saveStepOne = saveStepOne;
        vm.resendCode = resendCode;
        vm.uploadAcademics = uploadAcademics;
        vm.uploadOtherAcademics = uploadOtherAcademics;
        vm.loadingdoc = loadingdoc;
        vm.verifyCode = verifyCode;
        vm.onAcademicsSelect = onAcademicsSelect;
        vm.academics = {};
        vm.stepOne = {};
        vm.formPassport = {};
        vm.savePassport = savePassport;
        vm.formMobile = {};
        vm.saveMobile = saveMobile;
        vm.formCode = {};
        vm.resetCodeStatus = resetCodeStatus;
        vm.removeAcademic = removeAcademic;
        vm.removeOtherAcademic = removeOtherAcademic;

        init();

        function init() {
            loadingdoc();
            getTutorDetail();
        }

        /*
         * 
         */
        function getTutorDetail() {
            if ($localStorage.currentTutor.id) {
                var tutorid = {id: $localStorage.currentTutor.id};
                DashboardService.getTutorDetails(tutorid, function (result) {
                    vm.tutor = result;
//                    vm.buildstage = vm.tutor.buildstage;
                });
            }
        }
        
        /*
         * Profile build till Step One
         */
        function saveStepOne() {
            var data = {_id: $localStorage.currentTutor.id, buildstage : 'step2'};
            StepService.saveSteps(data,function(result){
                if (result === true) {
                    $state.go('build.step2');
                } else {
                    
                }
            });
            
        }

        function resendCode() {
            var data = {_id: $localStorage.currentTutor.id, mobileno: vm.tutor.verifyMobile.mobileno};
            StepService.resendVerificationCode(data, function (result) {
                if (result === true) {
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Please check your email."};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again."};
                }
            });
        }

        function uploadAcademics(file,errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: webservices.uploadAcademics,
                    data: {file: file, _id: vm.tutor._id, academicName: vm.tutor.academicName}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        }

        function uploadOtherAcademics(file,errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: webservices.uploadOtherDocs,
                    data: {file: file, _id: vm.tutor._id, otherName: vm.tutor.otherName}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        }
        
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();
            });
        }
        
        function verifyCode() {
            var data = {_id: $localStorage.currentTutor.id , verificationCode:vm.verifycode};
            vm.formCode.$setPristine();
            vm.formCode.$setUntouched();
            StepService.checkVerificationCode(data, function (result) {
                if (result === true) {
                    vm.codestatus = {type: 'success', message: "Success! You may proceed to next step."};
                } else {
                    vm.codestatus = {type: 'error', message: "Error! Please enter correct verification code."};
                }
            });
        }
        
        function onAcademicsSelect(files){
            if(files) {
                vm.academics = {name:files.name};
            }
            
        }
        
        function savePassport(){
            var data = {_id: $localStorage.currentTutor.id, passportNo : vm.tutor.passportNo};
            StepService.savePassport(data, function (result) {
                if (result === true) {
                    vm.passportstatus = true;
                } else {
                    vm.passportstatus = false;
                }
            });
        }
        
        function saveMobile(){
            var data = {_id: $localStorage.currentTutor.id, newmobileno:vm.tutor.verifyMobile.mobileno };
            StepService.getVerificationCode(data, function (result) {
                if (result === true) {
                    vm.passportstatus = true;
                } else {
                    vm.passportstatus = false;
                }
            });
        }
        
        function resetCodeStatus(){
            vm.codestatus = "";
        }

        function removeAcademic(value,index){
            var data = {_id: $localStorage.currentTutor.id, academic:value };
            StepService.removeAcademic(data, function (result) {
                if (result === true) {
                    angular.element('#academic_'+index).remove();
                    
                } else {
                    //vm.passportstatus = false;
                }
            });
        }

        function removeOtherAcademic(value,index){
                    var data = {_id: $localStorage.currentTutor.id, otheracademic:value };
                    StepService.removeOtherDocs(data, function (result) {
                        if (result === true) {
                            angular.element('#otherdoc_'+index).remove();
                        } else {
                            //vm.passportstatus = false;
                        }
                    });
                }


    }

})();