'use strict';

angular.module('latchApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        

            .state('app', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'views/landing.html'
//                        controller  : 'IndexController'
                    }
                }

            })
    		
			.state('app.register', {
                url:'register',
                views: {
                    'content@': {
                        templateUrl : 'views/register.html'
//                        controller  : 'IndexController'
                    }
                }

            })
		
			.state('app.login', {
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login.html'
//                        controller  : 'IndexController'
                    }
                }

            })

            .state('app.profile', {
                url:'profile',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html'
//                        controller  : 'IndexController'
                    }
                }

            })


            .state('app.main', {
                url:'main',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/home.html'
//                        controller  : 'IndexController'
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
    
            // route for the friends page
            .state('app.friends', {
                url:'sample',
                views: {
                    'content@': {
                        templateUrl : 'views/friends.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })
		
			// route for the chats page
            .state('app.chats', {
                url:'chats',
                views: {
                    'content@': {
                        templateUrl : 'views/chats.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })
		
			// route for the groups page
            .state('app.groups', {
                url:'sample',
                views: {
                    'content@': {
                        templateUrl : 'views/groups.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })
		
			// route for the test page
            .state('app.sample', {
                url:'sample',
                views: {
                    'content@': {
                        templateUrl : 'views/sample.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })
		
		;
        
        // route to redirect to home in case URL not defined
        $urlRouterProvider.otherwise('/');
	
    })

    .directive("compareTo", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) { 
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    })
;
