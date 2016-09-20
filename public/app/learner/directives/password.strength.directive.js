(function () {
    'use strict';
    angular
            .module('la-app')
            .directive('passwordStrength', passwordStrength)
            .directive('patternValidator', patternValidator);

    function passwordStrength() {
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                password: '=ngModel'
            },
            link: function (scope, elem, attrs, ctrl) {
                scope.$watch('password', function (newVal) {

                    scope.strength = isSatisfied(newVal && newVal.length >= 8) +
                            isSatisfied(newVal && /[A-z]/.test(newVal)) +
                            isSatisfied(newVal && /(?=.*\W)/.test(newVal)) +
                            isSatisfied(newVal && /\d/.test(newVal));

                    function isSatisfied(criteria) {
                        return criteria ? 1 : 0;
                    }
                }, true);
            },
            template: '<div class="progress pswd-lngth">' +
                        '<div class="prgrs-bx-col">' +
                            '<div class="progress-bar progress-bar-danger" role="progressbar" '+
                            'style="width: {{strength >= 1 ? 100 : 0}}%"></div>'+
                        '</div>' +
                        '<div class="prgrs-bx-col">' +
                            '<div class="progress-bar progress-bar-warning" role="progressbar" '+
                            'style="width: {{strength >= 2 ? 100 : 0}}%"></div>'+
                        '</div>' +
                        '<div class="prgrs-bx-col">' +
                            '<div class="progress-bar progress-bar-success" role="progressbar" '+
                            'style="width: {{strength >= 3 ? 100 : 0}}%"></div>'+
                        '</div>' +
                        '<p>{{}}</p>' +
                    '</div>'
        }
    }

    function patternValidator() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {

                    var patt = new RegExp(attrs.patternValidator);

                    var isValid = patt.test(viewValue);

                    ctrl.$setValidity('passwordPattern', isValid);

                    // angular does this with all validators -> return isValid ? viewValue : undefined;
                    // But it means that the ng-model will have a value of undefined
                    // So just return viewValue!
                    return viewValue;

                });
            }
        };
    }

})();
