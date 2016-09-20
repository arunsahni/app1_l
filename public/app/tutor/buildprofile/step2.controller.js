(function () {
    'use strict';
    angular
            .module('tutor-app')
            .controller('StepTwoController', StepTwoController)
            ;
    StepTwoController.$inject = ['$state', 'StepService','$localStorage'];

    function StepTwoController($state, StepService, $localStorage) {
        var vm = this;
        vm.init = init;
        vm.saveStepTwo = saveStepTwo;
        vm.loadingdoc = loadingdoc;
        vm.getLocationsData = getLocationsData;
        vm.getSubjectsData = getSubjectsData;
        vm.updateSubjectsModel = updateSubjectsModel;

        // Config options for various plugins
        vm.sliderOptions = {
            min: 0,
            max: 200,
            step: 1,
            precision: 0,
            value: 14,
            orientation: 'horizontal', // vertical
            handle: 'round', //'square', 'triangle' or 'custom'
            tooltip: 'show', //'hide','always'
            tooltipseparator: ':',
            tooltipsplit: false,
            enabled: true,
            naturalarrowkeys: false,
            range: false,
            ngDisabled: false,
            reversed: false
        };
        vm.formatterFn = function (value) {
            return '$' + value + '/hr';
        };
        vm.subjectmodel = [];
        vm.subjectsettings = {externalIdProp: '', showCheckAll: false, showUncheckAll: false, buttonClasses: 'btn btn-default', scrollableHeight: '200px', scrollable: true, displayProp: 'level'};

        vm.color = '#FFF000';
        vm.colorOptions = {
            required: true,
            disabled: false,
            round: false,
            format: 'hex',
            hue: true,
            alpha: false,
            swatch: true,
            swatchPos: 'left',
            swatchBootstrap: true,
            swatchOnly: true,
            pos: 'bottom left',
            case: 'upper',
            inline: false,
            placeholder: '',
        };
        // Locations data
        vm.locationConfig = {
            maxItems: 1,
            optgroupField: 'region',
            labelField: 'name',
            valueField: 'name',
            searchField: ['name'],
            render: {
                optgroup_header: function (data, escape) {
                    return '<div class="optgroup-header">' + escape(data.region) + '<div>';
                }
            },
            optgroups: [
                {value: 'East-West Line', region: 'East-West Line'},
                {value: 'North-East Line', region: 'North-East Line'},
                {value: 'North South Line', region: 'North South Line'},
                {value: 'Circle Line', region: 'Circle Line'},
                {value: 'Downtown Line', region: 'Downtown Line'},
                {value: 'Thomson-East Coast Line', region: 'Thomson-East Coast Line'}
            ]
        };

        init();
        
        function init() {
            loadingdoc();
            getLocationsData();
            getSubjectsData();
        }
        
        function saveStepTwo() {
            var levels = [];
            var leveldata = _.map(vm.subjectsLevel, 'levels');
            
            _(leveldata).forEach(function(value){
               
                 _(value).forEach(function(level){
                    levels.push(level);
                });
                
            });
            var initialData = {_id: $localStorage.currentTutor.id, teachingSub : levels};
            StepService.saveSubjects(initialData, function(result) {
                if (result === true) {
                    var data = {_id: $localStorage.currentTutor.id, buildstage : 'step3'};
                    StepService.saveSteps(data,function(result){
                        if (result === true) {
                            $state.go('build.step3');
                        } else {
                            
                        }
                    });
                    
                } else {
                    
                }
            });            

        }
        
        function loadingdoc() {
            angular.element(document).ready(function () {
                window.asd = $('.SlectBox').SumoSelect();

            });
        }
        
        function updateSubjectsModel(){
            vm.subjectsModel = angular.copy(vm.subjectmodel );
            vm.subjectsLevel = _.chain(angular.copy(vm.subjectmodel))
                    .groupBy("name")
                    .toPairs()
                    .map(function (currentItem) {
                        return _.zipObject(["name", "levels"], currentItem);
                    })
                    .value();            
        }
        
        /*
         * 
        */
       function getLocationsData(){
            StepService.getLocationsData(function (result) {
                vm.locations = result;
            });
       }
        
       function getSubjectsData(){
            StepService.getSubjectsData(function (result) {
                vm.subjects = result;
                vm.subjects = _.map(vm.subjects, function (element) {
                    return _.extend({}, element, {rate: 0}, {location: null});
                });
            });
       }
    

    }

})();