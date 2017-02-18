'use strict';

angular.module('latchApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: '/',
          views: {
              'content': {
                  templateUrl: 'views/landing.html'
              }
          }

      })

      .state('app.register', {
          url: 'register',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/register.html'
              }
          }

      })

      .state('app.login', {
          url: 'login',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/login.html'
              }
          }

      })


      .state('app.nick', {
          url: 'nick',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/nick.html'
              }
          }

      })
      .state('app.profile_pic', {
          url: 'profile_pic',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/profile_pic.html'
              }
          }

      })
       .state('app.interests', {
          url: 'interests',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/interests.html'
              }
          }

      })

      .state('app.profile', {
          url: 'profile',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/profile.html'
              }
          }

      })


      .state('app.main', {
          url: 'main',
          views: {
              'header@': {
                  templateUrl: 'views/header.html',
              },
              'content@': {
                  templateUrl: 'views/home.html'
              }
          }

      })

      // route for the map page
      .state('app.location', {
          url: 'location',
          views: {
              'header@': {
                  templateUrl: 'views/header.html',
              },
              'content@': {
                  templateUrl: 'views/location.html'
              }
          }
      })

      // route for the chats page
      .state('app.chats', {
          url: 'chats',
          views: {
              'header@': {
                  templateUrl: 'views/header.html',
              },
              'content@': {
                  templateUrl: 'views/chats.html'
              }
          }
      })



      // route for the groups page
      .state('app.groups', {
          url: 'groups',
          views: {
              'header@': {
                  templateUrl: 'views/header.html',
              },
              'content@': {
                  templateUrl: 'views/groups.html'
              }
          }
      })

      .state('app.message', {
          url: 'message',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/messages.html'
              }
          }
      })


      .state('app.group_info', {
          url: 'group_info',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/group_info.html'
              }
          }
      })

     .state('app.group_message', {
          url: 'group_message',
          views: {
              'header@': {
                  templateUrl: 'views/group_chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/group_messages.html'
              }
          }
      })

      .state('app.settings', {
          url: 'settings',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/settings.html'
              }
          }
      })

      .state('app.edit_profile', {
          url: 'edit_profile',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/edit_profile.html'
              }
          }
      })

      .state('app.change_password', {
          url: 'change_password',
          views: {
              'header@': {
                  templateUrl: 'views/chat_header.html',
              },
              'content@': {
                  templateUrl: 'views/change_password.html'
              }
          }
      })

       .state('app.logout', {
         url: '/',
          views: {
              'content@': {
                  templateUrl: 'views/landing.html'
              }
          }
      })

      // route for the test page
     

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

.run(function ($rootScope, $state, $location) {



  if(!window.localStorage.getItem('registrationId')){
    pushNotification();
  }


    var history = [];

    $rootScope.$on('$locationChangeStart', function() {
        history.push($location.$$path);
//        console.log(history);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
//        console.log(prevUrl);
        $location.path(prevUrl);
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        // event.preventDefault();
        // console.log(event);
        event.defaultPrevented = true;
        var loggedIn = window.localStorage.getItem('loggedIn');
        if  ((toState.name !== 'app' && toState.name !== 'app.register' && toState.name !== 'app.login'  && toState.name !== 'app.nick'  && toState.name !== 'app.profile_pic')   && !loggedIn){
            $state.go('app');
        }
        else{
            event.defaultPrevented = false;
            if  ($location.url() == '/' && loggedIn){
                $location.url('/chats')
            }
        }  
        
       
    });

});
