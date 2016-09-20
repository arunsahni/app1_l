(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('specialexpertisesController', specialexpertisesController);

    specialexpertisesController.$inject = ['AuthService','specialexpertisesService','$state','$stateParams','Upload','$timeout'];

    function specialexpertisesController(AuthService, specialexpertisesService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getSpecialexpertises = getSpecialexpertises;
        vm.getSpecialexpertise = getSpecialexpertise;
        vm.addSpecialexpertise = addSpecialexpertise;
        vm.editSpecialexpertise = editSpecialexpertise;
        vm.removeSpecialexpertise = removeSpecialexpertise;
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
        vm.expertises = [];
        vm.expertiseDetails = {};
        vm.expertise = {};
        vm.status = {};
        init();

        function init() {
            if($state.current.name == 'admin.expertises' ) {
                 getSpecialexpertises(); 
            }
            
            if($state.current.name == 'admin.viewexpertise' ) {
               var id = $stateParams.id;
               getSpecialexpertise(id);
            }
            if($state.current.name == 'admin.editexpertise' ) {
               var id = $stateParams.id;
               getSpecialexpertise(id);
            }
        }
        
        function datePicker() {
            vm.datepickerOpened = true;
        };

        function getSpecialexpertises() {
            specialexpertisesService.getCountSpecialexpertises(function(data){
                console.log("Data:",data);
                vm.expertises = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            specialexpertisesService.getSpecialexpertises(page, function(data){
                vm.expertises = data;
            });
        };
        
        function getSpecialexpertise(id) {
            specialexpertisesService.getSpecialexpertise(id, function(data){
                data.expertiseDate = new Date(data.expertiseDate);
                vm.expertise = data;
            });
        }
        
        function addSpecialexpertise() {
            if(vm.expertiseDetails){
                specialexpertisesService.addSpecialexpertise(vm.expertiseDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.expertises');
                        vm.expertiseDetails = {};
                    }
                });
              
            }
        }
        
        function editSpecialexpertise() {
            if(vm.expertise){    
                specialexpertisesService.editSpecialexpertise(vm.expertise,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                        $state.go('admin.expertises');
                        vm.expertise = {};
                    }
                });
            }
        }
        
        function removeSpecialexpertise(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this expertise?")){
                    specialexpertisesService.removeSpecialexpertise({_id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.expertises');
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
