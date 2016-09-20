(function () {
    'use strict';

    angular.module('tutor-app',
            [
                'ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'satellizer', 'ngStorage', 'angularMoment', 'angular-svg-round-progressbar', 'ngFileUpload', 'ui.mask', 'ui.bootstrap-slider', 'angularjs-dropdown-multiselect', 'color.picker','selectize'
            ])

            .factory('authInterceptor', ['$localStorage', authInterceptor])
            .config(routeConfig)
            .run(runConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$authProvider'];
    runConfig.$inject = ['$rootScope', '$state', '$http', '$localStorage'];

    function authInterceptor($localStorage) {

        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($localStorage.currentTutor) {
                    config.headers.Authorization = 'JWT ' + $localStorage.currentTutor.token;
                }
                return config;
            },
        };

    }

    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $authProvider) {

        $locationProvider.hashPrefix("!");
        $httpProvider.interceptors.push('authInterceptor');

        $authProvider.facebook({
            clientId: facebookConstants.facebook_app_id
        });

        $authProvider.google({
            clientId: googleConstants.google_client_id
        });

        $stateProvider
                .state('anon', {
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        access: 0
                    }
                })
                .state('anon.home', {
                    url: '/',
                    templateUrl: '/app/tutor/home/index.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.whyteachwithus', {
                    url: '/why-teach-with-us',
                    templateUrl: '/app/tutor/home/why-teach-with-us.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.verify-email', {
                    url: '/verify-email/:token',
                    templateUrl: '/app/tutor/home/accountactivation.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function (AuthService, $stateParams) {
                            return AuthService.verifyEmail($stateParams.token, function (result) {
                                return result;
                            });
                        }
                    }
                });
        // Dashboard
        $stateProvider
                .state('tutor', {
                    abstract: true,
                    //template: '<ui-view/>',
                    views: {
                        '': {
                            templateUrl: '/app/tutor/dashboard/index.html',
                            controller: 'DashboardController', 
                            controllerAs: 'vm'
                        },
                    },
                    data: {
                        access: 1
                    }
                })
                .state('tutor.home', {
                    url: '/dashboard',
                    views: {
                        'dashboard@tutor': {
                            templateUrl: '/app/tutor/dashboard/dashboard.html'
                        },
                    },
                })
                .state('tutor.account', {
                    url: '/my-account',
                    views: {
                        'account@tutor': {templateUrl: '/app/tutor/account/index.html'},
                    }
                })
                .state('tutor.account.settings', {
                    url: '/settings',
                    views: {
                        'settings@tutor.account': {
                            templateUrl: '/app/tutor/account/settings.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        },
                    }
                })
                .state('tutor.account.notifications', {
                    url: '/notifications',
                    views: {
                        'notification@tutor.account': {
                            templateUrl: '/app/tutor/account/notifications.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('tutor.account.profile', {
                    url: '/profile',
                    views: {
                        'profile@tutor.account': {
                            templateUrl: '/app/tutor/account/profile.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('tutor.account.banking', {
                    url: '/banking',
                    views: {
                        'banking@tutor.account': {
                            templateUrl: '/app/tutor/account/banking.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                });
        
        // Build Profile
        $stateProvider
                .state('build', {
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        access: 2
                    }
                })
                .state('build.step1', {
                    url: '/build-profile/step1',
                    templateUrl: '/app/tutor/buildprofile/step1.html',
                    controller: 'StepOneController',
                    controllerAs: 'vm'
                })
                .state('build.step2', {
                    url: '/build-profile/step2',
                    templateUrl: '/app/tutor/buildprofile/step2.html',
                    controller: 'StepTwoController',
                    controllerAs: 'vm'
                })
                .state('build.step3', {
                    url: '/build-profile/step3',
                    templateUrl: '/app/tutor/buildprofile/step3.html',
                    controller: 'StepThreeController',
                    controllerAs: 'vm'
                })
                .state('build.step4', {
                    url: '/build-profile/step4',
                    templateUrl: '/app/tutor/buildprofile/step4.html',
                    controller: 'StepFourController',
                    controllerAs: 'vm'
                })                

        $urlRouterProvider.otherwise('/');
    }

    function runConfig($rootScope, $state, $http, $localStorage) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            window.scrollTo(0, 0);
            window.asd = $('.SlectBox').SumoSelect();
            $rootScope.tutorstatus = $localStorage.tutorstatus;
        });

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var restrictedPage = (toState.name.indexOf('tutor') || toState.name.indexOf('build')) > -1;
            if (restrictedPage && !$localStorage.currentTutor) {
                event.preventDefault();
                $state.go('anon.home');
            }
        });
    }
})();
