(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('certificatesController', certificatesController);

    certificatesController.$inject = ['AuthService','certificatesService','$state','$stateParams','Upload','$timeout'];

    function certificatesController(AuthService, certificatesService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getCertificates = getCertificates;
        vm.getCertificate = getCertificate;
        vm.addCertificate = addCertificate;
        vm.editCertificate = editCertificate;
        vm.removeCertificate = removeCertificate;
        vm.deleteImageCertificates = deleteImageCertificates;
        vm.datePicker = datePicker;
        vm.closeAlert = closeAlert;
        vm.datepickerOpened = false;
        vm.setPage = setPage;
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.certificates = [];
        vm.certificateDetails = {};
        vm.certificate = {};
        vm.status = {};
        
        init();

        function init() {
            if($state.current.name == 'admin.certificates' ) {
                 getCertificates(); 
            }
            
            if($state.current.name == 'admin.viewcertificate' ) {
               var id = $stateParams.id;
               getCertificate(id);
            }
            if($state.current.name == 'admin.editcertificate' ) {
               var id = $stateParams.id;
               getCertificate(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getCertificates() {
            certificatesService.getCountCertificates(function(data){
                vm.certificates = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            certificatesService.getCertificates(page, function(data){
                vm.certificates = data;
            });
        };
        
        function getCertificate(id) {
            certificatesService.getCertificate(id, function(data){
                data.certificateDate = new Date(data.certificateDate);
                vm.certificate = data;
            });
        }
        
        function addCertificate() {
            if(vm.certificateDetails){
                var file = vm.certificateDetails.file;
                    file.upload = Upload.upload({
                    url: '/certificates/addImage-certificates',
                    data: {file: file},
                });
                file.upload.then(function (response) {
                    vm.certificateDetails.image = response.data.data;
                    
                    certificatesService.addCertificate(vm.certificateDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.certificates');
                        vm.certificateDetails = {};
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
        
        function editCertificate() {
            if(vm.certificate){    
                if(vm.certificate.file){
                    var file = vm.certificate.file;
                        file.upload = Upload.upload({
                        url: '/certificates/addImage-certificates',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.certificate.image = response.data.data;
                        certificatesService.editCertificate(vm.certificate,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.certificates');
                                vm.certificate = {};
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
                    if(vm.certificate.image){
                        delete vm.certificate.image;
                    }
                    certificatesService.editCertificate(vm.certificate,function(data){
                        if(data.status === 200) {
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.certificates');
                            vm.certificate = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageCertificates(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                certificatesService.deleteImageCertificates(jsonString, function (response) {
                    if (response.data.status == 200) {
                        $state.reload();
                    }
                })
            }
	};
        
        function removeCertificate(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this certificate?")){
                    certificatesService.removeAnnouncement({id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.certificates');
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