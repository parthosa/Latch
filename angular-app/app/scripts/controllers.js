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

    .controller('sampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	$scope.data = 'abc';
		$scope.array = [1,2,3,4];
    }])
        
;
