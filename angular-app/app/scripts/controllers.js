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

	.controller('RegisterController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])
    
	.controller('LoginController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
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
