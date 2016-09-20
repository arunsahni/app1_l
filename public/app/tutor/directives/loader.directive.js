(function () {
    'use strict';
    angular
            .module('tutor-app')
            .directive('tutorLoader', tutorLoader);
    
    tutorLoader.$inject = ['$http'];
    
    function tutorLoader($http) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if (v) {
                        elm.show();
                    } else {
                        elm.hide();
                    }
                });
            }
        };
    }
})();