(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('institutionController', institutionController);

    institutionController.$inject = ['AuthService','InstitutionService','$state','$stateParams','Upload','$timeout'];

    function institutionController(AuthService, InstitutionService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getInstitutions = getInstitutions;
        vm.getInstitution = getInstitution;
        vm.createInstitution = createInstitution;
        vm.updateInstitution = updateInstitution;
        vm.deleteInstitution = deleteInstitution;
        vm.deleteImageInstitutions = deleteImageInstitutions;
        vm.setPage = setPage;
        vm.closeAlert = closeAlert;
      
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.InstitutionType = ["School", "University"];
        
        vm.institutions = [];
        vm.institutionDetails = {};
        vm.institution = {};
        
        vm.status = {};
        
        init();

        function init() {
            if($state.current.name == 'admin.institutions' ) {
                getInstitutions(); 
            }
            
            if($state.current.name == 'admin.viewinstitution' ) {
               var id = $stateParams.id;
               getInstitution(id);
            }
            if($state.current.name == 'admin.editinstitution' ) {
               var id = $stateParams.id;
               getInstitution(id);
            }
        }

        function getInstitutions() {
            InstitutionService.getCountInstitutions(function(data){
                vm.institutions = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            InstitutionService.getInstitutions(page, function(data){
                vm.institutions = data;
            });
        };
        
        function getInstitution(id) {
            InstitutionService.getInstitution(id, function(data){
                vm.institution = data;
            });
        }
        
        function createInstitution() {
            if(vm.institutionDetails){
                var file = vm.institutionDetails.file;
                    file.upload = Upload.upload({
                    url: '/institutions/addImage-institutions',
                    data: {file: file},
                });
                file.upload.then(function (response) {
                    vm.institutionDetails.image = response.data;
                    InstitutionService.addInstitution(vm.institutionDetails,function(data){
                    if(data.status === 200) {
                         vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.institutions');
                        vm.institutionDetails = {};
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
        
        function updateInstitution() {
            if(vm.institution){    
                if(vm.institution.file){
                    var file = vm.institution.file;
                        file.upload = Upload.upload({
                        url: '/institutions/addImage-institutions',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.institution.image = response.data;
                        InstitutionService.editInstitution(vm.institution,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.institutions');
                                vm.institution = {};
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
                    if(vm.institution.image){
                        delete vm.institution.image;
                    }
                    InstitutionService.editInstitution(vm.institution,function(data){
                        if(data.status === 200) {
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.institutions');
                            vm.institution = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageInstitutions(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                InstitutionService.deleteImageInstitutions(jsonString, function (response) {
                    if (response.data.status == 200) {
                        $state.reload();
                    }
                })
            }
	};
        
        function deleteInstitution(id,index) {
//            console.log(id);
//            console.log(index);
//            angular.element("#row_"+index).remove();
//            return false;
            if(id){
                if(confirm("Are you sure, you want to remove this Institution?")){
                    InstitutionService.removeInstitution({id: id},function(response){
                        if(response === true) {
                           angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.institutions');
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