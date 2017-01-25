'use strict';

var globalVar;

angular.module('latchApp')
	.controller('MainController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
		$rootScope.isActive = function (arg) {
			if ($state.current.url == arg) {
				console.log($state.current.url);
				return true;
			} else
				return false;
		}

    }])

.controller('SampleController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$scope.data = 'abc';
	$scope.array = [1, 2, 3, 4];
    }])

.controller('RegisterController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('LoginController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('LocationController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	
	function initMap() {
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 20.8912676,
				lng: 73.7361989
			},
			zoom: 5,
			zoomControl: false,
			streetViewControl: false,
			fullscreenControl: false
		});

		$rootScope.getCurrLoc = function () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					
					var marker = new google.maps.Marker({
						position: pos
					});
					map.setCenter(pos);
					marker.setMap(map);
					map.setZoom(13);
				}, function () {
					Materialize.toast('Please enable loaction services', 3000);
				});
			} else {
				Materialize.toast('Please enable loaction services', 3000);
			}
		}

		var markers = locations.map(function (location, i) {
			return new google.maps.Marker({
				position: location,
				label: labels[i % labels.length]
			});
		});

		// Add a marker clusterer to manage the markers.
		var markerCluster = new MarkerClusterer(map, markers, {
			imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
		});

		$rootScope.getCurrLoc();
		
	}

	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	var locations = [
		{
			lat: 20.38,
			lng: 75.57
		},
		{
			lat: 21.38,
			lng: 75.57
		},
		{
			lat: 22.38,
			lng: 75.57
		},
		{
			lat: 23.38,
			lng: 75.57
		},
		{
			lat: 24.38,
			lng: 75.57
		},
		{
			lat: 25.38,
			lng: 75.57
		},
		{
			lat: 26.38,
			lng: 75.57
		},
		{
			lat: 19.38,
			lng: 75.57
		},
		{
			lat: 18.38,
			lng: 75.57
		},
		{
			lat: 17.38,
			lng: 75.57
		},
		{
			lat: 16.38,
			lng: 75.57
		},
		{
			lat: 15.38,
			lng: 75.57
		},
		{
			lat: 27.38,
			lng: 75.57
		},
		{
			lat: 28.38,
			lng: 75.57
		},
		{
			lat: 29.38,
			lng: 75.57
		},
		{
			lat: 14.38,
			lng: 75.57
		},
		{
			lat: 30.38,
			lng: 75.57
		},
		{
			lat: 31.38,
			lng: 75.57
		},
		{
			lat: 13.38,
			lng: 75.57
		},
		{
			lat: 12.38,
			lng: 75.57
		},
		{
			lat: 11.38,
			lng: 75.57
		},
		{
			lat: 31.38,
			lng: 75.57
		},
		{
			lat: 10.38,
			lng: 75.57
		}
      ]


	initMap();
}])

.controller('ChatController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('GroupController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('MessageController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('SidebarController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])


;