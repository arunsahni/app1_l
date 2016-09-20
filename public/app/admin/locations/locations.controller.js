(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('locationController', locationController);

    locationController.$inject = ['AuthService','locationsService','$state','$stateParams'];

    function locationController(AuthService, locationsService, $state, $stateParams) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getLocations = getLocations;
        vm.getLocation = getLocation;
        vm.create = create;
        vm.update = update;
        vm.deleteLocation = deleteLocation;
        vm.setPage = setPage;
        vm.closeAlert = closeAlert;
        vm.sort = sort;
        
        vm.locationData = [];
        vm.locationDetails = {};
        vm.location = {};
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.status = {};
        
        vm.sortDir = 'desc';
        vm.sortBy = 'email';
        
        init();

        function init() {
         
            if($state.current.name == 'admin.locations' ) {
                 getLocations(); 
            }
            
            if($state.current.name == 'admin.viewlocation' ) {
               var id = $stateParams.id;
               getLocation(id);
            }
            if($state.current.name == 'admin.editlocation' ) {
               var id = $stateParams.id;
               getLocation(id);
            }
        }

        function getLocations() {
            locationsService.getCountLocations(function(data){
                vm.locationData = data[0].data.data;
                vm.totalItems = data[1].data.data;
//                console.log("hi ctrl: ",vm.totalItems);
            });
        }
        
        function getLocation(id) {
            locationsService.getLocation(id, function(data){
                vm.location = data;
            });
        }
        
        function create() {
          
            if(vm.locationDetails){
                locationsService.addLocation(vm.locationDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.locations');
                        vm.locationDetails = {};
                        
                    }
                });
            }
          
        }
        
        function update() {
            if(vm.location){
                locationsService.editLocation(vm.location,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                        $state.go('admin.locations');
                        vm.location = {};
                        
                    }
                });
            }
        }
        function deleteLocation(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this location?")){
                    locationsService.removeLocation({_id: id},function(data){
                        if(data === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.locations');
                        }
                    });
                }
                
            }
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            locationsService.getLocations(page, function(data){
                vm.locationData = data;
            });
        };
        
        function closeAlert() {
            vm.status = {};
        }
        
        function sort(sortBy) {
            vm.sortDir = (vm.sortDir == 'desc') ? 'asc' : 'desc';
            vm.sortBy = sortBy;
            var sort = {sortBy : vm.sortBy, sortDir: vm.sortDir};
            locationsService.getLocations(sort, function(data){
                vm.locationData = data;
            });
        };

    }

})();