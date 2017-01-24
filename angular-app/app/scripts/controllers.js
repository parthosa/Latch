'use strict';

var globalVar;

angular.module('latchApp')
    .controller('MainController', ['$scope', function($scope) {
        

    }])

    .controller('sampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	$scope.data = 'abc';
		$scope.array = [1,2,3,4];
    }])
        
;
