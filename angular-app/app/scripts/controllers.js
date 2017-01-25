'use strict';

var globalVar;
var baseUrl = 'http://localhost:8000';
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

	.controller('RegisterController', ['$rootScope', '$scope', '$state','$location', function($rootScope, $scope, $state,$location) {
		$rootScope.title = 'Register'
		$rootScope.back = function(){
			$location.path('/')
		}
    	$scope.user = {};
        $scope.user.name = 'partho'
        $scope.user.contact = 'hell.partho@gmail.com'
        $scope.user.password = 'tech'
        $scope.user.confirm_password = 'tech'

        $scope.submit = function(){
            // $location.path('/chats');
            
            $.ajax({
                method:'POST',
                url:baseUrl+'/main/accounts/register/',
                data:$scope.user,
                type:'jsonp',
                success:function (response) {
                    if(response.status==1)
                        $location.path('/nick');
                    Materialize.toast(response.message, 1000)

                },
                error:function (response) {
                    console.log(response)
                }
            })
        }
    }])
    
	.controller('LoginController', ['$rootScope', '$scope', '$state','$location', function($rootScope, $scope, $state,$location) {
		$rootScope.title = 'Login'
		$rootScope.back = function(){
			$location.path('/')
		}
    	$scope.user = {};
        $scope.user.contact = 'hell.partho@gmail.com';
        $scope.user.password = 'tech';

        $scope.submit = function(){

            $.ajax({
                method:'POST',
                url:baseUrl+'/main/accounts/login/',
                data:$scope.user,
                success:function (response) {
                     if(response.status==1)
                        $location.path('/chats');
                    Materialize.toast(response.message, 1000)

                },
                error:function (response) {
                }
            })
        }

}])

.controller('NickController', ['$rootScope', '$scope', '$state','$location', function($rootScope, $scope, $state,$location) {
		$rootScope.title = 'Nick'

        $scope.user = {};
        $scope.user.nick = 'parthosa';

        $scope.submit = function(){

            $.ajax({
                method:'POST',
                url:baseUrl+'/main/user/nick/',
                data:$scope.user,
                success:function (response) {
                     if(response.status==1)
                        $location.path('/chats');
                    Materialize.toast(response.message, 1000)

                },
                error:function (response) {
                }
            })
        }

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

.controller('HeaderSmallController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
		// $scope.title = 'Hello'
    }])

.controller('ChatController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('GroupController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('GroupInfoController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$rootScope.title='Group Info'
    }])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$rootScope.title='Profile'

    }])

.controller('MessageController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$rootScope.title='John Doe'
	$rootScope.user = {
		name:'partho'
	}
	$scope.messages=[
		{
			nick:'partho',
			pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
			text:'hello world',
			time:'15:30pm'
		},
		{
			nick:'pragati',
			pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
			text:'bol world',
			time:'18:30pm'
		}
	];

	$scope.newMessage={};
	$scope.newMessage.user=$rootScope.user.name,
	$scope.newMessage.message=''
	$scope.newMessage.session_id=''
	$scope.newMessage.nick = 'yo',
	$scope.newMessage.pic = 'http://www.canitinguru.com/image/data/aboutme.jpg',
	$scope.newMessage.text = 'sahi world',
	$scope.newMessage.time = '10:30pm'
	
	$scope.send = function(){
		$scope.messages.append($scope.newMessage)
		$scope.newMessage.text = ''
		$.ajax({
			method:'POST',
			url:baseUrl+'/main/user/message',
			data:$scope.newMessage,
			success:function(response){
			}
		})
	}

    }])


.controller('SidebarController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])


