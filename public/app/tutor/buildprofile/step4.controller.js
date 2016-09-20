(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('StepFourController', StepFourController)
            ;
    StepFourController.$inject = ['$state', 'StepService','AccountService','$localStorage','DashboardService'];

    function StepFourController($state, StepService, AccountService,$localStorage,DashboardService) {
        var vm = this;
        vm.tutor = {};
        vm.init = init;
        vm.saveStepFour = saveStepFour;
        vm.loadingdoc = loadingdoc;
        vm.closeAlert = closeAlert;
        vm.saveExperience = saveExperience;
        vm.getSubjectsData = getSubjectsData;
        
        // plugins configuration
        vm.subjectConfig = {labelField: 'name', valueField: 'name', searchField: ['name'],};
        vm.instituteConfig = {
            maxItems: 1, 
            labelField: 'name', 
            valueField: 'name', 
            searchField: ['name'],
            optgroupField: 'type',
            render: {
                optgroup_header: function (data, escape) {
                    return '<div class="optgroup-header">' + escape(data.region) + '<div>';
                }
            },
            optgroups: [
                {value: 'Secondary', region: 'Secondary'},
                {value: 'ITE', region: 'ITE'},
                {value: 'JCE', region: 'JCE'},
                {value: 'Poly', region: 'Poly'},
                {value: 'International Schools', region: 'International Schools'},
                {value: 'Local University', region: 'Local University'},
                {value: 'Private Institutions', region: 'Private Institutions'},
                {value: 'Foreign University', region: 'Foreign University'}
            ]
 };

        init();
        
        function init() {
            loadingdoc();
            getTutorDetail();
            getInstitutionsData();
            getSubjectsData();
        }
        
        function saveStepFour() {
            var details = {_id: vm.tutor._id, personalityTraits : vm.tutor.personalityTraits, isEnabled:true};
            AccountService.updateTutorProfile(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"personality"};
                    $state.go('tutor.home');
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"personality"};
                }
            });
            
        }
        
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();

            });
        }
        
        function closeAlert() {
             vm.status = {};
        }

        function getTutorDetail() {
            if ($localStorage.currentTutor.id) {
                var tutorid = {id: $localStorage.currentTutor.id};
                DashboardService.getTutorDetails(tutorid, function (result) {
                    vm.tutor = result;
                });
            }
        }

        function getInstitutionsData(){
            StepService.getInstitutionsData(function (result) {
                vm.institutions = result;
            });
        }

        function getSubjectsData(){
            StepService.getSubjectsData(function (result) {
                vm.subjects = result;
                /*vm.subjects = _.map(vm.subjects, function (element) {
                    return _.extend({}, element, {rate: 0}, {location: null});
                });*/
            });
       }

        function saveExperience(){
            var details = {_id: vm.tutor._id, teachingExp : vm.tutor.institute};
            AccountService.addExperience(details,function (result) {
                if (result === true) {
                    details = {};
                    vm.status = {class: 'alert alert-success fade in', message: "Success! Data updated successfully.", type:"bank"};
                } else {
                    vm.status = {class: 'alert alert-danger fade in', message: "Error! Please try again.", type:"bank"};
                }
            });
        }

    }

})();