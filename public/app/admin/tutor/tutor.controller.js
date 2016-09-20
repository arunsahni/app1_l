(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('tutorController', tutorController);

    tutorController.$inject = ['AuthService','adminService','$state','$stateParams'];

    function tutorController(AuthService, adminService, $state, $stateParams) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getTutors = getTutors;
        vm.getTutor = getTutor;
        vm.create = create;
        vm.update = update;
        vm.deleteTutor = deleteTutor;
        vm.setPage = setPage;
        vm.manageStatus = manageStatus;
        vm.closeAlert = closeAlert;
        vm.sort = sort;
        vm.verifyTutor = verifyTutor;
        
        vm.tutorData = [];
        vm.tutorDetails = {};
        vm.tutor = {};
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.status = {};
        
        vm.sortDir = 'desc';
        vm.sortBy = 'email';
//        vm.badgeslist = [{id:1,_id:"57d6a4d2097d161618ed82a4",name:"Badge","texttoDisplay":"Excellent","image":"tiger.jpg","__v":0,"isDeleted":false},
//                         {id:2,_id:"57d6a4d2097d161618ed82a4",name:"Meet face to face","texttoDisplay":"Excellent","image":"tiger.jpg","__v":0,"isDeleted":false},
//                         {id:3,_id:"57d6a4d2097d161618ed82a4",name:"Verified","texttoDisplay":"Excellent","image":"tiger.jpg","__v":0,"isDeleted":false}
//                        ];
//          vm.badgeslist = [
//            {id:1, name: 'Intermediate', type: 'Maths',color:'#fff000' },
//            {id:2, name: 'Sec2', type: 'Maths',color:'#fff000' },
//            {id:3, name: 'Sec4', type: 'Maths',color:'#fff000' },
//            {id:4, name: 'Intermediate', type: 'Biology',color:'#fff000' },
//            {id:5, name: 'Beginners', type: 'Physics',color:'#fff000' },
//            {id:6, name: 'Amateaur', type: 'Physics',color:'#fff000'}
//        ];
       
        vm.badgemodel = []; 
        vm.badgesettings = {externalIdProp: '',showCheckAll:false,showUncheckAll:false,buttonClasses:'btn btn-default', scrollableHeight: '200px',scrollable: true,displayProp : 'name'};
        
        init();

        function init() {
         
            if($state.current.name == 'admin.tutors' ) {
                 getTutors(); 
            }
            
            if($state.current.name == 'admin.viewtutor' ) {
               var id = $stateParams.tutorId;
               getTutor(id);
            }
            if($state.current.name == 'admin.edittutor' ) {
               var id = $stateParams.tutorId;
               getTutor(id);
            }
        }

        function getTutors() {
            adminService.getCountTutors(function(data){
                vm.tutorData = data[0].data.data;
                vm.totalItems = data[1].data.data;
//                console.log("hi ctrl: ",vm.totalItems);
            });
        }
        
        function getTutor(tutorId) {
            adminService.getTutor(tutorId, function(data){
                console.log("Badges",data[0].data.data);
                console.log("tutors",data[1].data.data);
                angular.forEach(data[0].data.data, function(value , key) {
                    value.id = key;
                });
//                vm.badges = data[0].data.data;
//                vm.totalItems = data[1].data.data;
                vm.badgeslist = data[0].data.data;
                vm.tutor = data[1].data.data;
            });
        }
        
        function create() {
          
            if(vm.tutorDetails){
                adminService.addTutor(vm.tutorDetails,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.tutors');
                        vm.tutorDetails = {};
                        
                    }
                });
            }
          
        }
        
        function update() {
            if(vm.tutor){
                adminService.editTutor(vm.tutor,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                        $state.go('admin.tutors');
                        vm.tutor = {};
                        
                    }
                });
            }
        }
        function deleteTutor(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this tutor?")){
                    adminService.removeTutor({_id: id},function(data){
                        if(data.status === 200) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.tutors');
                        }
                    });
                }
                
            }
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            adminService.getTutors(page, function(data){
                vm.tutorData = data;
            });
        };
        
        function manageStatus(accountstatus){
            adminService.manageStatus({_id: $stateParams.tutorId,accountStatus: accountstatus},function(data){
                    if(data.status === 200) {
                        $state.go('admin.tutors');
                    }
                });
        }
        
        function closeAlert() {
            vm.status = {};
        }
        
        function sort(sortBy) {
            vm.sortDir = (vm.sortDir == 'desc') ? 'asc' : 'desc';
            vm.sortBy = sortBy;
            var sort = {sortBy : vm.sortBy, sortDir: vm.sortDir};
            adminService.getTutors(sort, function(data){
                vm.tutorData = data;
            });
        };
        
        function verifyTutor() {
//            console.log("Hi clicked",vm.badgemodel);
            if(vm.badgemodel){
                var badgesId = [];
                angular.forEach(vm.badgemodel, function(value , key) {
                    badgesId.push(value._id);
                });
              
                var dataObj = {
                    _id: $stateParams.tutorId,
                    isEnabled: true,
                    tutorBadges: badgesId,
                    email: vm.tutor.email
                };
                adminService.verifyTutor(dataObj,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data verified successfully."};
                        $state.go('admin.tutors');
                    }
                });
            }
        }
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