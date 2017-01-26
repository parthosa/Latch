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
		
		$rootScope.title = '';
		
		$rootScope.back = function(){
			if ($state.current.url == 'register'||'login')
				$location.path('/');
			if ($state.current.url == 'nick')
				$location.path('/');
		}

    }])

.controller('SampleController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$scope.data = 'abc';
	$scope.array = [1, 2, 3, 4];
    }])

	.controller('RegisterController', ['$rootScope', '$scope', '$state','$location', function($rootScope, $scope, $state,$location) {

		$rootScope.title = 'Register'
		$rootScope.back = function(){
			 $state.go('app');
		}
		
    	$scope.user = {};
        $scope.user.name = 'partho';
        $scope.user.contact = 'hell.partho@gmail.com';
        $scope.user.password = 'tech';
        $scope.user.confirm_password = 'tech';

        $scope.submit = function(){
            // $location.path('/chats');
            
            $.ajax({
                method:'POST',
                url:baseUrl+'/main/accounts/register/',
                data:$scope.user,
                type:'jsonp',
                success:function (response) {
                    if(response.status==1)
                        $state.go('app.nick');
                       
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
			 $state.go('app');
			
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
                        $state.go('app.chats');
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
                        $state.go('app.chats');
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
		// $scope.title = 'Hello';
    }])

.controller('ChatController', ['$rootScope', '$scope', '$state','$location', 'chatData',function ($rootScope, $scope, $state,$location,chatData) {
    	$scope.chats = [
    		{
    			nick:'Partho',
    			id:'234',
				pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
				last_message:'hii',
				time:'15:30pm'

    		},
    		{
    			nick:'amritanshu',
    			id:'341',
				pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
				last_message:'bol chut',
				time:'05:30pm'

    		},
    		{
    			nick:'Partho',
    			id:'123',
				pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
				last_message:'hii',
				time:'15:30pm'

    		}
    	];

    	$scope.redirect = function(el){
    		chatData.chatId = el.chat.id
    		$rootScope.title = el.chat.nick;
    		$location.url('/message')
    	}

    }])

.controller('GroupController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])

.controller('GroupInfoController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	$rootScope.title='Group Info';
    }])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

	$rootScope.title='Profile'
	$rootScope.back = function(){
			$state.go('app.chats');
	}
    }])

.controller('MessageController', ['$rootScope', '$scope', '$state','chatData','$location', function ($rootScope, $scope, $state,chatData,$location) {
	// $rootScope.title='John Doe'
	$rootScope.user = {
		nick:'partho',
		pic: 'http://www.canitinguru.com/image/data/aboutme.jpg'
	}

	$rootScope.back = function(){
			$state.go('app.chats');
	}


	// sending chat id to recieve messages

	$.ajax({
		method:'POST',
		url:'http://localhost:8000/main/user/nick',
		data:{
			'chatId':chatData.chatId,

		},
		success:function(response){
			console.log(response)
		},
		error:function(response){
			// console.log(response)
		}
	})
	$scope.messages=[
		{
			nick:'partho',
			pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
			text:'hello world',
			time:'15:30pm',
			msg_id:'p314'
		},
		{
			nick:'pragati',
			pic:'http://www.canitinguru.com/image/data/aboutme.jpg',
			text:'bol world',
			time:'18:30pm',
			msg_id:'u232'
		}
	];

	$scope.newMessageText='';
	
	$scope.send = function(){
		var time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });


		var newMessage={
			user:$rootScope.user.nick,
			text:$scope.newMessageText,
			chat_id:'',
			nick: $rootScope.user.nick,
			pic: $rootScope.user.pic,
			time: time,
			sent:false,
			msg_id:'iu99'
		}


		$scope.messages.push(newMessage);
		$scope.newMessageText = '';

		

			

		$.ajax({
			method:'POST',
			url:baseUrl+'/main/user/message',
			data:newMessage,
			success:function(response){
				// var respMessage={
				// 	text:$scope.newMessageText,
				// 	nick: $rootScope.user.nick,
				// 	pic: $rootScope.user.pic,
				// 	time: time,
				// 	msg_id:'iu99',
				// 	sent:false
				// }
				var respMessage = response;
				for (var i = $scope.messages.length - 1; i >= 0; i--) 
					if($scope.messages[i].msg_id==respMessage.msg_id)
						$scope.messages[i].sent=true
			},
			error:function(response){
				Materialize.toast(response.message,1000);
			}
		})
	}

    }])


.controller('SidebarController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    }])


