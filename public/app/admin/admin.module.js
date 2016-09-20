(function () {
    'use strict';

    angular.module('adminapp',
            [
                'ngAnimate', 'ngSanitize', 'ui.router', 'ngStorage', 'ngFileUpload', 'ui.bootstrap','angularjs-dropdown-multiselect'
            ])

            .factory('authInterceptor', ['$localStorage', authInterceptor])
            .config(routeConfig)
            .run(runConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];
    runConfig.$inject = ['$rootScope', '$state', '$http', '$localStorage'];

    function authInterceptor($localStorage) {

        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($localStorage.adminUser) {
                    config.headers.Authorization = 'JWT ' + $localStorage.adminUser.token;
                }
                return config;
            },
        };

    }


    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $locationProvider.hashPrefix("!");
        $httpProvider.interceptors.push('authInterceptor');

        $stateProvider
                .state('anon', {
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        access: 3
                    }
                })
                .state('anon.login', {
                    url: '/',
                    templateUrl: '/app/admin/login.html',
                    controller: 'AdminController',
                    controllerAs: 'vm'
                });

        $stateProvider
                .state('admin', {
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        access: 2
                    }
                })
                .state('admin.home', {
                    url: '/',
                    templateUrl: '/app/admin/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })
                .state('admin.dashboard', {
                    url: '/dashboard',
                    templateUrl: '/app/admin/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })

                // tutors
                .state('admin.tutors', {
                    url: '/tutors',
                    templateUrl: '/app/admin/tutor/view-tutors.html',
                    controller: 'tutorController',
                    controllerAs: 'vm'
                })
                .state('admin.viewtutor', {
                    url: '/view-tutor/:tutorId',
                    templateUrl: '/app/admin/tutor/view-tutor.html',
                    controller: 'tutorController',
                    controllerAs: 'vm'
                })
                .state('admin.addtutor', {
                    url: '/tutor/create',
                    templateUrl: '/app/admin/tutor/add-tutor.html',
                    controller: 'tutorController',
                    controllerAs: 'vm'
                })
                .state('admin.edittutor', {
                    url: '/edit-tutor/:tutorId',
                    templateUrl: '/app/admin/tutor/edit-tutor.html',
                    controller: 'tutorController',
                    controllerAs: 'vm'
                })

                //learners

                .state('admin.learners', {
                    url: '/learners',
                    templateUrl: '/app/admin/learner/view-learners.html',
                    controller: 'learnerController',
                    controllerAs: 'vm'
                })
                .state('admin.viewlearner', {
                    url: '/view-learner/:learnerId',
                    templateUrl: '/app/admin/learner/view-learner.html',
                    controller: 'learnerController',
                    controllerAs: 'vm'
                })
                .state('admin.addlearner', {
                    url: '/learner/create',
                    templateUrl: '/app/admin/learner/add-learner.html',
                    controller: 'learnerController',
                    controllerAs: 'vm'
                })
                .state('admin.editlearner', {
                    url: '/edit-learner/:learnerId',
                    templateUrl: '/app/admin/learner/edit-learner.html',
                    controller: 'learnerController',
                    controllerAs: 'vm'
                })

                // announcements
                .state('admin.announcements', {
                    url: '/announcements',
                    templateUrl: '/app/admin/announcements/view-announcements.html',
                    controller: 'announcementsController',
                    controllerAs: 'vm'
                })
                .state('admin.viewannouncement', {
                    url: '/view-announcement/:id',
                    templateUrl: '/app/admin/announcements/view-announcement.html',
                    controller: 'announcementsController',
                    controllerAs: 'vm'
                })
                .state('admin.addannouncement', {
                    url: '/announcement/create',
                    templateUrl: '/app/admin/announcements/add-announcements.html',
                    controller: 'announcementsController',
                    controllerAs: 'vm'
                })
                .state('admin.editannouncement', {
                    url: '/edit-announcement/:id',
                    templateUrl: '/app/admin/announcements/edit-announcements.html',
                    controller: 'announcementsController',
                    controllerAs: 'vm'
                })

                // institutions
                .state('admin.institutions', {
                    url: '/institutions',
                    templateUrl: '/app/admin/institutions/view-institutions.html',
                    controller: 'institutionController',
                    controllerAs: 'vm'
                })
                .state('admin.viewinstitution', {
                    url: '/view-institution/:id',
                    templateUrl: '/app/admin/institutions/view-institution.html',
                    controller: 'institutionController',
                    controllerAs: 'vm'
                })
                .state('admin.addinstitution', {
                    url: '/institution/create',
                    templateUrl: '/app/admin/institutions/add-institution.html',
                    controller: 'institutionController',
                    controllerAs: 'vm'
                })
                .state('admin.editinstitution', {
                    url: '/edit-institution/:id',
                    templateUrl: '/app/admin/institutions/edit-institution.html',
                    controller: 'institutionController',
                    controllerAs: 'vm'
                })

                // subjects
                .state('admin.subjects', {
                    url: '/subjects',
                    templateUrl: '/app/admin/subjects/view-subjects.html',
                    controller: 'subjectController',
                    controllerAs: 'vm'
                })
                .state('admin.viewsubject', {
                    url: '/view-subject/:id',
                    templateUrl: '/app/admin/subjects/view-subject.html',
                    controller: 'subjectController',
                    controllerAs: 'vm'
                })
                .state('admin.addsubject', {
                    url: '/subject/create',
                    templateUrl: '/app/admin/subjects/add-subject.html',
                    controller: 'subjectController',
                    controllerAs: 'vm'
                })
                .state('admin.editsubject', {
                    url: '/edit-subjects/:id',
                    templateUrl: '/app/admin/subjects/edit-subject.html',
                    controller: 'subjectController',
                    controllerAs: 'vm'
                })
                
                // badges
                .state('admin.badges', {
                    url: '/badges',
                    templateUrl: '/app/admin/badges/view-badges.html',
                    controller: 'badgesController',
                    controllerAs: 'vm'
                })
                .state('admin.viewbadge', {
                    url: '/view-badge/:id',
                    templateUrl: '/app/admin/badges/view-badge.html',
                    controller: 'badgesController',
                    controllerAs: 'vm'
                })
                .state('admin.addbadge', {
                    url: '/badge/add',
                    templateUrl: '/app/admin/badges/add-badge.html',
                    controller: 'badgesController',
                    controllerAs: 'vm'
                })
                .state('admin.editbadge', {
                    url: '/edit-badge/:id',
                    templateUrl: '/app/admin/badges/edit-badge.html',
                    controller: 'badgesController',
                    controllerAs: 'vm'
                })
                
                // banks
                .state('admin.banks', {
                    url: '/banks',
                    templateUrl: '/app/admin/banks/view-banks.html',
                    controller: 'banksController',
                    controllerAs: 'vm'
                })
                .state('admin.viewbank', {
                    url: '/view-bank/:id',
                    templateUrl: '/app/admin/banks/view-bank.html',
                    controller: 'banksController',
                    controllerAs: 'vm'
                })
                .state('admin.addbank', {
                    url: '/banks/add',
                    templateUrl: '/app/admin/banks/add-bank.html',
                    controller: 'banksController',
                    controllerAs: 'vm'
                })
                .state('admin.editbank', {
                    url: '/edit-bank/:id',
                    templateUrl: '/app/admin/banks/edit-bank.html',
                    controller: 'banksController',
                    controllerAs: 'vm'
                })
                
                // certificates
                .state('admin.certificates', {
                    url: '/certificates',
                    templateUrl: '/app/admin/certificates/view-certificates.html',
                    controller: 'certificatesController',
                    controllerAs: 'vm'
                })
                .state('admin.viewcertificate', {
                    url: '/view-certificate/:id',
                    templateUrl: '/app/admin/certificates/view-certificate.html',
                    controller: 'certificatesController',
                    controllerAs: 'vm'
                })
                .state('admin.addcertificate', {
                    url: '/certificates/add',
                    templateUrl: '/app/admin/certificates/add-certificate.html',
                    controller: 'certificatesController',
                    controllerAs: 'vm'
                })
                .state('admin.editcertificate', {
                    url: '/edit-certificate/:id',
                    templateUrl: '/app/admin/certificates/edit-certificate.html',
                    controller: 'certificatesController',
                    controllerAs: 'vm'
                })
                
                  
                // specialised areas
                .state('admin.specialisedareas', {
                    url: '/specialisedareas',
                    templateUrl: '/app/admin/teachingareas/view-teachingareas.html',
                    controller: 'specialisedareasController',
                    controllerAs: 'vm'
                })
                .state('admin.viewspecialisedarea', {
                    url: '/view-specialisedarea/:id',
                    templateUrl: '/app/admin/teachingareas/view-teachingarea.html',
                    controller: 'specialisedareasController',
                    controllerAs: 'vm'
                })
                .state('admin.addspecialisedarea', {
                    url: '/specialisedareas/add',
                    templateUrl: '/app/admin/teachingareas/add-teachingarea.html',
                    controller: 'specialisedareasController',
                    controllerAs: 'vm'
                })
                .state('admin.editspecialisedarea', {
                    url: '/edit-specialisedarea/:id',
                    templateUrl: '/app/admin/teachingareas/edit-teachingarea.html',
                    controller: 'specialisedareasController',
                    controllerAs: 'vm'
                })
                
                  
                // special expertise
                .state('admin.expertises', {
                    url: '/special-expertises',
                    templateUrl: '/app/admin/teachingexperts/view-teachingexperts.html',
                    controller: 'specialexpertisesController',
                    controllerAs: 'vm'
                })
                .state('admin.viewexpertise', {
                    url: '/view-special-expertise/:id',
                    templateUrl: '/app/admin/teachingexperts/view-teachingexpert.html',
                    controller: 'specialexpertisesController',
                    controllerAs: 'vm'
                })
                .state('admin.addexpertise', {
                    url: '/special-expertises/add-special-expertise',
                    templateUrl: '/app/admin/teachingexperts/add-teachingexpert.html',
                    controller: 'specialexpertisesController',
                    controllerAs: 'vm'
                })
                .state('admin.editexpertise', {
                    url: '/edit-special-expertise/:id',
                    templateUrl: '/app/admin/teachingexperts/edit-teachingexpert.html',
                    controller: 'specialexpertisesController',
                    controllerAs: 'vm'
                })
                
                // locations
                .state('admin.locations', {
                    url: '/locations',
                    templateUrl: '/app/admin/locations/view-locations.html',
                    controller: 'locationController',
                    controllerAs: 'vm'
                })
                .state('admin.viewlocation', {
                    url: '/view-location/:id',
                    templateUrl: '/app/admin/locations/view-location.html',
                    controller: 'locationController',
                    controllerAs: 'vm'
                })
                .state('admin.addlocation', {
                    url: '/location/add',
                    templateUrl: '/app/admin/locations/add-location.html',
                    controller: 'locationController',
                    controllerAs: 'vm'
                })
                .state('admin.editlocation', {
                    url: '/edit-location/:id',
                    templateUrl: '/app/admin/locations/edit-location.html',
                    controller: 'locationController',
                    controllerAs: 'vm'
                })
                ;
        $urlRouterProvider.otherwise('/');
    }

    function runConfig($rootScope, $state, $http, $localStorage) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            window.scrollTo(0, 0);
            $rootScope.adminstatus = $localStorage.adminstatus;
        });

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var restrictedPage = toState.name.indexOf('admin') > -1;
            if (restrictedPage && !$localStorage.adminUser ) {
                event.preventDefault();
                $state.go('anon.login');
            }
            if ((toState.name === "anon.login") && $localStorage.adminUser) {
                event.preventDefault();
                $state.go(fromState);
            }
        });
    }

})();
