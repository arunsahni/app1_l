angular
    .module('la-app')
    .directive('myFastSignup', myFastSignup);

function myFastSignup() {
    var directive = {
        link: link,
        templateUrl: 'app/layout/templates/fastsignup.html',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
      /* */
    }
}