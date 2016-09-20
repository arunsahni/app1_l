(function () {
    'use strict';

    angular
            .module('adminapp')
            .controller('subjectController', subjectController);

    subjectController.$inject = ['AuthService','subjectService','$state','$stateParams','Upload','$timeout'];

    function subjectController(AuthService, subjectService, $state, $stateParams,Upload,$timeout) {

        var vm = this;
        vm.isAuthenticated = false;
        vm.init = init;
        vm.getSubjects = getSubjects;
        vm.getSubject = getSubject;
        vm.createSubject = createSubject;
        vm.updateSubject = updateSubject;
        vm.deleteSubject = deleteSubject;
        vm.deleteImageSubject = deleteImageSubject;
        vm.setPage = setPage;
        vm.closeAlert = closeAlert;
        
        vm.maxSize = 5;
        vm.currentPage = 1;
        vm.pageLimit = 10;
        vm.subjectType = ["Academics", "Enrichment"];
        
        vm.level = [];
        vm.subjectLevel = [{id:1, name: 'Intermediate'},
                           {id:2, name: 'Secondary 4'}, 
                           {id:3, name: 'Secondary 2'}];
        vm.subjectsettings = {externalIdProp: '',showCheckAll:false,showUncheckAll:false,buttonClasses:'btn btn-default', scrollableHeight: '200px',scrollable: true,displayProp : 'name'};
         
        vm.subjects = [];
        vm.subjectDetails = {};
        vm.subject = {};
        vm.status = {};
        init();

        function init() {
            if($state.current.name == 'admin.subjects' ) {
                getSubjects(); 
            }
            if($state.current.name == 'admin.viewsubject' ) {
               var id = $stateParams.id;
               getSubject(id);
            }
            if($state.current.name == 'admin.editsubject' ) {
               var id = $stateParams.id;
               getSubject(id);
            }
        }

        function getSubjects() {
            subjectService.getCountSubjects(function(data){
                vm.subjects = data[0].data.data;
                vm.totalItems = data[1].data.data;
            });
        }
        
        function getSubject(id) {
            subjectService.getSubject(id, function(data){
                vm.subject = data;
            });
        }
        
        function setPage(pageNo) {
            vm.currentPage = pageNo;
            var page = {pageNo : pageNo};
            subjectService.getSubjects(page, function(data){
                vm.subjects = data;
            });
        };
        
        function createSubject() {
            if(vm.subjectDetails){
                var file = vm.subjectDetails.file;
                    file.upload = Upload.upload({
                    url: '/subject/addImage-subject',
                    data: {file: file}
                });
                file.upload.then(function (response) {
                    vm.subjectDetails.image = response.data;
                    angular.forEach(vm.level, function(value, key) {
                        delete value.id;
                    });
                 
                    var subjObj = {};
                    subjObj = vm.subjectDetails;
                    subjObj.level = vm.level;
                    console.log(subjObj);
                    subjectService.addSubject(subjObj,function(data){
                    if(data.status === 200) {
                        vm.status = {class: 'alert alert-success fade in', message: "Success! Data added successfully."};
                        $state.go('admin.subjects');
                        vm.subjectDetails = {};
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
        
        function updateSubject() {
            if(vm.subject){    
                if(vm.subject.file){
                    var file = vm.subject.file;
                        file.upload = Upload.upload({
                        url: '/subject/addImage-subject',
                        data: {file: file},
                    });
                    file.upload.then(function (response) {
                        vm.subject.image = response.data.data;
                        var level = vm.subject.level;
                        vm.subject.level.push({name: level});
                        subjectService.editSubject(vm.subject,function(data){
                            if(data.status === 200) {
                                vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                                $state.go('admin.subjects');
                                vm.subject = {};
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
                    if(vm.subject.image){
                        delete vm.subject.image;
                    }
                    subjectService.editSubject(vm.subject,function(data){
                        if(data.status === 200) {
                             vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully."};
                            $state.go('admin.subjects');
                            vm.subject = {};
                        }
                    });
                }
            }
        }
        
        function deleteImageSubject(id,img) {
            var ask = confirm('Are you sure to delete this image');
            var jsonString = "";
            if (ask) {
                jsonString = '{"id": "'+id+'", "image":"'+img+'"}';
                subjectService.deleteImageSubject(jsonString, function (response) {
                    if (response.data.status == 200) {
                        $state.reload();
                    }
                })
            }
	};
        
        function deleteSubject(id,index) {
            if(id){
                if(confirm("Are you sure, you want to remove this subject?")){
                    subjectService.removeSubject({id: id},function(response){
                        if(response === true) {
                            angular.element("#row_"+index).remove();
                            vm.status = {class: 'alert alert-success fade in', message: "Success! Data deleted successfully."};
                            $state.go('admin.subjects');
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