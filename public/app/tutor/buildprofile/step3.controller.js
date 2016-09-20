(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('StepThreeController', StepThreeController)
            ;
    StepThreeController.$inject =  ['$state', 'StepService', '$localStorage', 'DashboardService','AccountService','Upload','$timeout']

    function StepThreeController($state, StepService, $localStorage, DashboardService, AccountService, Upload,$timeout) {
        var vm = this;
        vm.init = init;
        vm.saveStepThree = saveStepThree;
        vm.loadingdoc = loadingdoc;
        vm.tutor = {};
        vm.refundPolicy = refundPolicy;
        vm.payoutFrequency = payoutFrequency;
        vm.getBanksData = getBanksData;
        vm.saveBank = saveBank;
        vm.uploadSupportDocs = uploadSupportDocs;
        vm.removeSupportDocs =removeSupportDocs;
        // plugins configuration
        vm.banksConfig = {maxItems: 1, labelField: 'bank', valueField: 'bank', searchField: ['bank'] };
        vm.accountType = accountType;
        vm.accountTypeConfig = {maxItems: 1, labelField: 'name', valueField: 'value', searchField: ['name']};
        
        init();
        
        function init() {
            loadingdoc();
            getTutorDetail();
            getBanksData();
        }
        
        /*
         * 
        */
        function getTutorDetail() {
            if ($localStorage.currentTutor.id) {
                var tutorid = {id: $localStorage.currentTutor.id};
                DashboardService.getTutorDetails(tutorid, function (result) {
                    vm.tutor = result;
                });
            }
        }
        
        function saveStepThree() {
            var data = {_id: $localStorage.currentTutor.id, buildstage : 'step4'};
            StepService.saveSteps(data,function(result){
                if (result === true) {
                    $state.go('build.step4');
                } else {
                    
                }
            });            
            
        }
        
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();

            });
        }

        /*
         * @desc - updates refundPolicy for the Tutor
         */
        function refundPolicy(){
            var data = {_id: $localStorage.currentTutor.id, refundPolicy:vm.tutor.refundPolicy };
            StepService.saveRefundPolicy(data, function (result) {
                if (result === true) {
                    //vm.passportstatus = true;
                } else {
                    //vm.passportstatus = false;
                }
            });
        }
        
        /*
         * @desc - updates payoutFrequency for the Tutor
         */
        function payoutFrequency(){
            var data = {_id: $localStorage.currentTutor.id, payoutFrequency:vm.tutor.payoutFrequency };
            StepService.savePayoutFrequency(data, function (result) {
                if (result === true) {
                    //vm.passportstatus = true;
                } else {
                    //vm.passportstatus = false;
                }
            });
        }
        
        function getBanksData(){
            StepService.getBanksData(function (result) {
                vm.banks = result;
            });
        }
        
        function saveBank(){
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

        function uploadSupportDocs(file,errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: webservices.uploadSupportDocs,
                    data: {file: file, _id: vm.tutor._id, supportName: vm.tutor.supportName}
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

                function removeSupportDocs(value,index){
                    var data = {_id: $localStorage.currentTutor.id, supportdoc:value };
                    StepService.removeSupportDocs(data, function (result) {
                        if (result === true) {
                            angular.element('#supportdoc_'+index).remove();
                        } else {
                            //vm.passportstatus = false;
                        }
                    });
                }

    }    

})();