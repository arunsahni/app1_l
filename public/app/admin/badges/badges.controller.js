(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('badgesController', badgesController);

    badgesController.$inject = ['AuthService','badgesService','$state','$stateParams','Upload','$timeout'];

    function badgesController(AuthService, badgesService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getBadges = getBadges;
        vm.getBadge = getBadge;
        vm.createBadge = createBadge;
        vm.updateBadge = updateBadge;
        vm.deleteBadge = deleteBadge;
        vm.deleteImageBadge = deleteImageBadge;
        vm.datePicker = datePicker;
        vm.setPage = setPage;
        vm.closeAlert = closeAlert;
        
        vm.datepickerOpened = false;
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        
        vm.badges = [];
        vm.badgesDetails = {};
        vm.badge = {};
        
        vm.status = {};
        
        init();

        function init() {
            if($state.current.name == 'admin.badges' ) {
                 getBadges(); 
            }
            
            if($state.current.name == 'admin.viewbadge' ) {
               var id = $stateParams.id;
               getBadge(id);
            }
            if($state.current.name == 'admin.editbadge' ) {
               var id = $stateParams.id;
               getBadge(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getBadges() {
            badgesService.getCountBadges(function(data){
                vm.badges = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            badgesService.getBadges(page, function(data){
                vm.badges = data;
            });
        };
        
        function getBadge(id) {
            badgesService.getBadge(id, function(data){
                data.badgeDate = new Date(data.badgeDate);
                vm.badge = data;
            });
        }
        
        function createBadge() {
            if(vm.badgesDetails){
                var file = vm.badgesDetails.file;
                    file.upload = Upload.upload({
                    url: '/badges/addImage-badges',
                    data: {file: file}
                });
                file.upload.then(function (response) {
                    vm.badgesDetails.image = response.data.data;
                    badgesService.addBadge(vm.badgesDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.badges');
                        vm.badgesDetails = {};
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
        
        function updateBadge() {
            if(vm.badge){    
                if(vm.badge.file){
                    var file = vm.badge.file;
                        file.upload = Upload.upload({
                        url: '/badges/addImage-badges',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.badge.image = response.data.data;
                        badgesService.editBadge(vm.badge,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.badges');
                                vm.badge = {};
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
                    if(vm.badge.image){
                        delete vm.badge.image;
                    }
                    badgesService.editBadge(vm.badge,function(data){
                        if(data.status === 200) {
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.badges');
                            vm.badge = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageBadge(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                badgesService.deleteImageBadge(jsonString, function (response) {
                    if (response.data.status == 200) {
                        $state.reload();
                    }
                })
            }
	};
        
        function deleteBadge(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this badge?")){
                    badgesService.removeBadge({id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.badges');
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