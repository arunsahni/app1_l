(function () {
    'use strict';

    angular.module('la-app',
            [
                'ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'satellizer', 'ngStorage', 'angularMoment', 'angular-svg-round-progressbar', 'ngFileUpload', 'ngParallax', 'selectize'
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
                if ($localStorage.currentUser) {
                    config.headers.Authorization = 'JWT ' + $localStorage.currentUser.token;
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
                    templateUrl: '/app/learner/home/index.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.why-teach-with-us', {
                    url: '/why-teach-with-us',
                    templateUrl: '/app/learner/home/why-teach-with-us.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.grow-business', {
                    url: '/grow-business',
                    templateUrl: '/app/learner/home/grow-business.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.tutor-toolkit', {
                    url: '/tutor-toolkit',
                    templateUrl: '/app/learner/home/tutor-toolkit.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.tutor-testimonials', {
                    url: '/tutor-testimonials',
                    templateUrl: '/app/learner/home/tutor-testimonials.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.learner', {
                    url: '/learner',
                    templateUrl: '/app/learner/home/learner.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.parent-static', {
                    url: '/parent-static',
                    templateUrl: '/app/learner/home/parent-static.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.parent-learner', {
                    url: '/parent-learner',
                    templateUrl: '/app/learner/home/parent-learner.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
                .state('anon.ethical-service', {
                    url: '/ethical-service',
                    templateUrl: '/app/learner/home/ethical-service.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function () {
                            return;
                        }
                    }
                })
//                .state('anon.accountactivation', {
//                    url: '/account-activation',
//                    templateUrl: '/app/learner/home/accountactivation.html',
//                })
                .state('anon.verify-email', {
                    url: '/verify-email/:token',
                    templateUrl: '/app/learner/home/accountactivation.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        verifyEmail: function (AuthService, $stateParams) {
                            return AuthService.verifyEmail($stateParams.token, function (result) {
                                return result;
                            });
                        }
                    }
                })
                ;
        // Dashboard
        $stateProvider
                .state('learner', {
                    abstract: true,
                    //template: '<ui-view/>',
                    views: {
                        '': {templateUrl: '/app/learner/dashboard/index.html', controller: 'DashboardController', controllerAs: 'vm'},
                    },
                    data: {
                        access: 1
                    }
                })
                .state('learner.home', {
                    url: '/dashboard',
                    views: {
                        'dashboard@learner': {templateUrl: '/app/learner/dashboard/dashboard.html'},
                    },
                })
                .state('learner.account', {
                    url: '/my-account',
                    views: {
                        'account@learner': {templateUrl: '/app/learner/account/index.html'},
                    }
                })
                .state('learner.account.settings', {
                    url: '/settings',
                    views: {
                        'settings@learner.account': {
                            templateUrl: '/app/learner/account/settings.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        },
                    }
                })
                .state('learner.account.notifications', {
                    url: '/notifications',
                    views: {
                        'notification@learner.account': {
                            templateUrl: '/app/learner/account/notifications.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('learner.account.profile', {
                    url: '/profile',
                    views: {
                        'profile@learner.account': {
                            templateUrl: '/app/learner/account/profile.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('learner.account.banking', {
                    url: '/banking',
                    views: {
                        'banking@learner.account': {
                            templateUrl: '/app/learner/account/banking.html',
                            controller: 'AccountController',
                            controllerAs: 'vm'
                        }
                    }
                });


        $urlRouterProvider.otherwise('/');
    }

    function runConfig($rootScope, $state, $http, $localStorage) {
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            window.scrollTo(0, 0);
            window.asd = $('.SlectBox').SumoSelect();
            $rootScope.loginstatus = $localStorage.loginstatus;
        });

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//            var restrictedPage = toState.name.indexOf('learner') > -1;
//            
//            if (restrictedPage && !$localStorage.currentUser ) {
//                event.preventDefault();
//                $state.go('anon.home');
//            }
        });
    }



})();
