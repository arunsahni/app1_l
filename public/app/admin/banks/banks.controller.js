(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('banksController', banksController);

    banksController.$inject = ['AuthService','banksService','$state','$stateParams','Upload','$timeout'];

    function banksController(AuthService, banksService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getBanks = getBanks;
        vm.getBank = getBank;
        vm.addBank = addBank;
        vm.editBank = editBank;
        vm.removeBank = removeBank;
        vm.deleteImageBank = deleteImageBank;
        vm.datePicker = datePicker;
        vm.datepickerOpened = false;
        vm.setPage = setPage;
        vm.closeAlert = closeAlert;
        
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.banks = [];
        vm.bankDetails = {};
        vm.bank = {};
        vm.status = {};
        init();

        function init() {
            if($state.current.name == 'admin.banks' ) {
                 getBanks(); 
            }
            
            if($state.current.name == 'admin.viewbank' ) {
               var id = $stateParams.id;
               getBank(id);
            }
            if($state.current.name == 'admin.editbank' ) {
               var id = $stateParams.id;
               getBank(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getBanks() {
            banksService.getCountBanks(function(data){
                vm.banks = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            banksService.getBanks(page, function(data){
                vm.banks = data;
            });
        };
        
        function getBank(id) {
            banksService.getBank(id, function(data){
                data.bankDate = new Date(data.bankDate);
                vm.bank = data;
            });
        }
        
        function addBank() {
            if(vm.bankDetails){
                var file = vm.bankDetails.file;
                    file.upload = Upload.upload({
                    url: '/banks/addImage-banks',
                    data: {file: file},
                });
                file.upload.then(function (response) {
                    vm.bankDetails.image = response.data.data;
                    console.log( vm.bankDetails)
                    banksService.addBank(vm.bankDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.banks');
                        vm.bankDetails = {};

                    }
                });
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
        
        function editBank() {
            if(vm.bank){    
                if(vm.bank.file){
                    var file = vm.bank.file;
                        file.upload = Upload.upload({
                        url: '/banks/addImage-banks',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.bank.image = response.data.data;
                        banksService.editBank(vm.bank,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.banks');
                                vm.bank = {};
                            }
                        });
                        $timeout(function () {
                                file.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                } else {
                    if(vm.bank.image){
                        delete vm.bank.image;
                    }
                    banksService.editBank(vm.bank,function(data){
                        if(data.status === 200) {
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.banks');
                            vm.bank = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageBank(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                banksService.deleteImageBank(jsonString, function (response) {
                    if (response === true) {
                        $state.reload();
                    }
                });
            }
	};
        
        function removeBank(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this bank?")){
                    banksService.removeBank({id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.banks');
                        }
                    });
                }
                
            }
        }
        
        function closeAlert() {
            vm.status = {};
        }

    }

})();