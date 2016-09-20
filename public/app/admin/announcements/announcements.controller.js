(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('announcementsController', announcementsController);

    announcementsController.$inject = ['AuthService','announcementsService','$state','$stateParams','Upload','$timeout'];

    function announcementsController(AuthService, announcementsService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getAnnouncements = getAnnouncements;
        vm.getAnnouncement = getAnnouncement;
        vm.createAnnouncement = createAnnouncement;
        vm.updateAnnouncement = updateAnnouncement;
        vm.deleteAnnouncement = deleteAnnouncement;
        vm.deleteImageAnnouncement = deleteImageAnnouncement;
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
        vm.announcements = [];
        vm.announcementsDetails = {};
        vm.announcement = {};
        
        vm.status = {};
        init();

        function init() {
            if($state.current.name == 'admin.announcements' ) {
                getAnnouncements(); 
            }
            
            if($state.current.name == 'admin.viewannouncement' ) {
               var id = $stateParams.id;
               getAnnouncement(id);
            }
            if($state.current.name == 'admin.editannouncement' ) {
               var id = $stateParams.id;
               getAnnouncement(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getAnnouncements() {
            announcementsService.getCountAnnouncements(function(data){
                vm.announcements = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            announcementsService.getAnnouncements(page, function(data){
                vm.announcements = data;
            });
        };
        
        function getAnnouncement(id) {
            announcementsService.getAnnouncement(id, function(data){
                data.announcementDate = new Date(data.announcementDate);
                vm.announcement = data;
            });
        }
        
        function createAnnouncement() {
            if(vm.announcementsDetails){
                var file = vm.announcementsDetails.file;
                    file.upload = Upload.upload({
                    url: '/announcement/addImage-announcement',
                    data: {file: file},
                });
                file.upload.then(function (response) {
                    vm.announcementsDetails.image = response.data;
                    announcementsService.addAnnouncement(vm.announcementsDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.announcements');
                        vm.announcementsDetails = {};

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
        
        function updateAnnouncement() {
            if(vm.announcement){    
                if(vm.announcement.file){
                    var file = vm.announcement.file;
                        file.upload = Upload.upload({
                        url: '/announcement/addImage-announcement',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.announcement.image = response.data;
                        announcementsService.editAnnouncement(vm.announcement,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.announcements');
                                vm.announcement = {};
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
                    if(vm.announcement.image){
                        delete vm.announcement.image;
                    }
                    announcementsService.editAnnouncement(vm.announcement,function(data){
                        if(data.status === 200) {
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.announcements');
                            vm.announcement = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageAnnouncement(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                announcementsService.deleteImageAnnouncement(jsonString, function (response) {
                    if (response === true) {
                        $state.reload();
                    }
                });
            }
	};
        
        function deleteAnnouncement(id,index) {
            
                if(confirm("Are you sure, you want to remove this announcement?")){
                    announcementsService.removeAnnouncement({id: id},function(response){
                        if(response.status === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.announcements');
                        }
                    });
                }
                
            
        }
        
        function closeAlert() {
            vm.status = {};
        }
        

    }

})();