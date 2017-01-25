'use strict';

var globalVar;

angular.module('latchApp')
    .controller('MainController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.isActive = function (arg) {
			if ($state.current.url == arg){
				console.log($state.current.url);
				return true;
			}
			else
				return false;
		}

    }])

    .controller('SampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	$scope.data = 'abc';
		$scope.array = [1,2,3,4];
    }])

	.controller('RegisterController', ['$rootScope', '$scope', '$state','$http','$location', function($rootScope, $scope, $state,$http,$location) {
    	$scope.user = {};
        $scope.user.name = 'partho'
        $scope.user.email = 'hell.partho@gmail.com'
        $scope.user.password = 'tech'
        $scope.user.confirm_password = 'tech'

        $scope.submit = function(){
            $location.path('/main');
            
            $http({
                method:'POST',
                url:'/',
                data:$scope.user,
                success:function (response) {
                    if(response.status!=1)
                        Materialize.toast('Try Again', 1000)
                     else
                        $location.path('/main');

                },
                error:function (response) {
                    console.log(response)
                }
            })
        }
    }])
    
	.controller('LoginController', ['$rootScope', '$scope', '$state','$http', function($rootScope, $scope, $state,$http) {
    	$scope.user = {};
        $scope.user.email = '';
        $scope.user.password = '';

        $scope.submit = function(){
            $location.path('/main');

            $http({
                method:'POST',
                url:'/',
                data:$scope.user,
                success:function (response) {
                     if(response.status!=1)
                        Materialize.toast('Try Again', 1000)
                     else
                        $location.path('/main');

                },
                error:function (response) {
                    console.log(response)
                }
            })
        }
    }])
    
	.controller('MapController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	.controller('ChatController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	.controller('GroupController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	.controller('ProfileController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	.controller('MessageController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])

	.controller('SidebarController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	
;
