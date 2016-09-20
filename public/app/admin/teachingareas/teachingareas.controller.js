(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('specialisedareasController', specialisedareasController);

    specialisedareasController.$inject = ['AuthService','specialisedareasService','$state','$stateParams','Upload','$timeout'];

    function specialisedareasController(AuthService, specialisedareasService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getSpecialisedareas = getSpecialisedareas;
        vm.getSpecialisedarea = getSpecialisedarea;
        vm.addSpecialisedarea = addSpecialisedarea;
        vm.editSpecialisedarea = editSpecialisedarea;
        vm.removeSpecialisedarea = removeSpecialisedarea;
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
        vm.specialisedareas = [];
        vm.specialisedareaDetails = {};
        vm.specialisedarea = {};
        vm.status = {};
        init();

        function init() {
            if($state.current.name == 'admin.specialisedareas' ) {
                 getSpecialisedareas(); 
            }
            
            if($state.current.name == 'admin.viewspecialisedarea' ) {
               var id = $stateParams.id;
               getSpecialisedarea(id);
            }
            if($state.current.name == 'admin.editspecialisedarea' ) {
               var id = $stateParams.id;
               getSpecialisedarea(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getSpecialisedareas() {
            specialisedareasService.getCountSpecialisedareas(function(data){
                vm.specialisedareas = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            specialisedareasService.getSpecialisedareas(page, function(data){
                vm.specialisedareas = data;
            });
        };
        
        function getSpecialisedarea(id) {
            specialisedareasService.getSpecialisedarea(id, function(data){
                data.specialisedareaDate = new Date(data.specialisedareaDate);
                vm.specialisedarea = data;
            });
        }
        
        function addSpecialisedarea() {
            if(vm.specialisedareaDetails){
                specialisedareasService.addSpecialisedarea(vm.specialisedareaDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.specialisedareas');
                        vm.specialisedareaDetails = {};
                    }
                });
            }
        }
        
        function editSpecialisedarea() {
            if(vm.specialisedarea){    
                specialisedareasService.editSpecialisedarea(vm.specialisedarea,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                        $state.go('admin.specialisedareas');
                        vm.specialisedarea = {};
                    }
                });
            }
        }
  
        function removeSpecialisedarea(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this specialisedarea?")){
                    specialisedareasService.removeSpecialisedarea({_id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.specialisedareas');
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
