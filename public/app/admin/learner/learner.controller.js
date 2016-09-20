(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('learnerController', learnerController);

    learnerController.$inject = ['AuthService','learnerService','$state','$stateParams'];

    function learnerController(AuthService, learnerService, $state, $stateParams) {

        var vm = this;
        vm.init = init;
        vm.getLearners = getLearners;
        vm.getLearner = getLearner;
        vm.createLearner = createLearner;
        vm.updateLearner = updateLearner;
        vm.deleteLearner = deleteLearner;
        vm.manageStatus = manageStatus;
        vm.sortBy = sortBy;
        vm.closeAlert = closeAlert;
        vm.setPage = setPage;
        vm.sort = sort;
         
        vm.learners = [];
        vm.learnerDetails = {};
        vm.learner = {};
        vm.status = {};
        
        vm.isAuthenticated = false;
        
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        
        vm.sortDir = 'desc';
        vm.sortBy = 'email';
        
        init();

        function init() {
            if($state.current.name == 'admin.learners' ) {
                 getLearners(); 
            }
            
            if($state.current.name == 'admin.viewlearner' ) {
               var id = $stateParams.learnerId;
               getLearner(id);
            }
            if($state.current.name == 'admin.editlearner' ) {
               var id = $stateParams.learnerId;
               getLearner(id);
            }
        }

        function getLearners() {
            learnerService.getCountLearners(function(data){
                console.log("result : ",data)
                vm.learners = data[0].data.data;
                vm.totalItems = data[1].data.data;
                console.log("hi ctrl: ",vm.learners);
            });
        }
        
        function getLearner(learnerId) {
            learnerService.getLearner(learnerId, function(data){
                vm.learner = data;
            });
        }
        
        function createLearner() {
            
            if(vm.learnerDetails){
                learnerService.addLearner(vm.learnerDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.learners');
                        vm.learnerDetails = {};
                        
                    }
                });
            }
          
        }
        
        function updateLearner() {
            if(vm.learner){
                learnerService.editLearner(vm.learner,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                        $state.go('admin.learners');
                        vm.learner = {};
                    }
                });
            }
        }
        
        function deleteLearner(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this learner?")){
                    learnerService.removeLearner({_id: id},function(data){
                        if(data.status === 200) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.learners');
                        }
                    });
                }
                
            }
        }
        
        function manageStatus(accountstatus){
            learnerService.manageStatus({_id: $stateParams.learnerId,accountStatus: accountstatus},function(data){
                    if(data.status === 200) {
                        $state.go('admin.learners');
                    }
                });
        }
       
        function sortBy(propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };
        
        function closeAlert() {
            vm.status = {};
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            learnerService.getLearners(page, function(data){
                vm.learners = data;
            });
        };
        
         function sort(sortBy) {
            vm.sortDir = (vm.sortDir == 'desc') ? 'asc' : 'desc';
            vm.sortBy = sortBy;
            var sort = {sortBy : vm.sortBy, sortDir: vm.sortDir};
            learnerService.getLearners(sort, function(data){
                vm.learners = data;
            });
        };
        // To get index 
//        function getObjArrayIdxByKey(ObjArr , matchKey , matchVal){
//            var idx;
//            for( var loop = 0; loop < ObjArr.length; loop++ ){
//                    if (ObjArr[loop].hasOwnProperty(matchKey)) {
//                            if(ObjArr[loop][matchKey] == matchVal){
//                                    idx = loop;
//                                    break;
//                            }
//                    }
//            }
//            return idx;
//        }
    }

})();