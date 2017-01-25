'use strict';

angular.module('latchApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        

            .state('app', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'views/landing.html'
                    }
                }

            })
    		
			.state('app.register', {
                url:'register',
                views: {
                    'content@': {
                        templateUrl : 'views/register.html'
                    }
                }

            })
		
			.state('app.login', {
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login.html'
                    }
                }

            })

            .state('app.profile', {
                url:'profile',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html'
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
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
    
            // route for the map page
            .state('app.map', {
                url:'map',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/map.html'
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
		
			// route for the chats page
            .state('app.chats', {
                url:'chats',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/chats.html'
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
		
			// route for the groups page
            .state('app.groups', {
                url:'groups',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/groups.html'
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
		
			.state('app.message', {
                url:'message',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/groups.html'
                    },
                    'footer@': {
                        templateUrl : 'views/footer.html',
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
