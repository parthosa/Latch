'use strict';

var globalVar;
var baseUrl = 'http://localhost:8001';
var socket = io.connect('localhost', {port: 4000});
var map;

angular.module('latchApp')

    .controller('MainController', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location) {

        $rootScope.isActive = function(arg) {
            if ($state.current.url == arg) {
//                console.log($state);
                return true;
            } else
                return false;
        }
        
        $(".button-collapse").sideNav();

        $rootScope.search = {
          visible: false,
          query: '',
          toggle: function() {
            $rootScope.search.visible = true;
            setTimeout(function() {
            $('#search')[0].focus();
            },300);
          },
          close: function () {
            $rootScope.search.visible = false;
            $rootScope.search.query = '';
          }
        };

    }])

.controller('SampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    $scope.data = 'abc';
    $scope.array = [1, 2, 3, 4];
}])

.controller('RegisterController', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location) {

    $rootScope.title = 'Register';
//    $rootScope.back = function() {
//        $state.go('app');
//    }

    $scope.user = {};
    $scope.user.name = 'partho';
    $scope.user.contact = 'hell.partho@gmail.com';
    $scope.user.password = 'tech';
    $scope.user.confirm_password = 'tech';

    $scope.submit = function() {
        // $location.path('/chats');

        $.ajax({
            method: 'POST',
            url: baseUrl + '/main/accounts/register/',
            data: $scope.user,
            type: 'jsonp',
            success: function(response) {
                if (response.status == 1){
                    $state.go('app.nick');
                    window.localStorage.setItem('user_session',response.user_session);
                }

                Materialize.toast(response.message, 1000)

            },
            error: function(response) {
                console.log(response)
            }
        })
    }
}])

.controller('LoginController', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location) {
    $rootScope.title = 'Login';

    $scope.user = {};
    $scope.user.contact = 'hell.partho@gmail.com';
    $scope.user.password = 'tech';

    $scope.submit = function() {

        $.ajax({
            method: 'POST',
            url: baseUrl + '/main/accounts/login/',
            data: $scope.user,
            success: function(response) {
                if (response.status == 1){
                    $state.go('app.chats');
                    window.localStorage.setItem('user_session',response.user_session);
                }
                Materialize.toast(response.message, 1000)

            },
            error: function(response) {}
        })
    }

}])

.controller('NickController', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location) {
    $rootScope.title = 'Nick';

    $scope.user = {};
    $scope.user.nick = 'parthosa';

    $scope.submit = function() {

        $.ajax({
            method: 'POST',
            url: baseUrl + '/main/user/nick/',
            data: $scope.user,
            success: function(response) {
                if (response.status == 1)
                    $state.go('app.chats');
                Materialize.toast(response.message, 1000)

            },
            error: function(response) {}
        })
    }

}])

.controller('LocationController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
  
    $scope.sendLoc;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 20.8912676,
                lng: 73.7361989
            },
            zoom: 5,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        $rootScope.getCurrLoc = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
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
                }, function() {
                    Materialize.toast('Please enable loaction services', 3000);
                });
            } else {
                Materialize.toast('Please enable loaction services', 3000);
            }
        }

        var markers = locations.map(function(location, i) {
            var marker = new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
          marker.setMap(map);
          google.maps.event.addListener(marker, "click", function (event) {
              $scope.sendLoc = this.position;
            return marker;
      });
        });
      
        // Create marker
        function genMarker(location) {
          var marker = new new google.maps.Marker({
                position: location,
                label: lo
            });
        }

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });

        $rootScope.getCurrLoc();

    }

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//    var locations = [{lat:28.36, lng: 75.58}];
    var locations = [{lat: 28.38, lng: 75.57 }, {lat: 28.37, lng: 75.58 }, {lat: 28.36, lng: 75.58 }, {lat: 28.39, lng: 75.58 }];
  
  var sampleLocData = [
    {
      position: new google.maps.LatLng(28.365, 75.57),
      pic: 'https://avatars3.githubusercontent.com/u/10223953',
    }
  ]
    
  initMap();
    
}])

.controller('HeaderSmallController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    // $scope.title = 'Hello';
}])

.controller('ChatController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function($rootScope, $scope, $state, $location, chatData) {
    $scope.chats = [{
        nick: 'Partho',
        id: '234',
        pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
        last_message: 'hii',
        time: '15:30pm'

    }, {
        nick: 'amritanshu',
        id: '341',
        pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
        last_message: 'bol chut',
        time: '05:30pm'

    }, {
        nick: 'Partho',
        id: '123',
        pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
        last_message: 'hii',
        time: '15:30pm'

    }];
  

    $scope.redirect = function(el) {
        chatData.chatId = el.chat.id;
        chatData.chatUrl = '/users';
        $location.url('/message');
        $rootScope.title = el.chat.nick;
        $rootScope.chatPic = el.chat.pic;
        //            console.log($rootScope.title);
    }

}])


.controller('GroupController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function($rootScope, $scope, $state, $location, chatData) {
    $scope.groups = [{
        nick: 'Food',
        id: '234',
        pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
        members: '3'
    }, {
        nick: 'Car',
        id: '341',
        pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
        members: '7'
    }, {
        nick: 'Chutiye',
        id: '123',
        pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
        members: '8'
    }];
  
    $scope.redirect = function(el) {
        chatData.chatId = el.group.id;
        chatData.chatUrl = '/groups';
        $location.url('/message');
        $rootScope.title = el.group.nick;
        $rootScope.chatPic = el.group.pic;
        //            console.log($rootScope.title);
    }
}])

.controller('GroupInfoController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    $rootScope.title = 'Group Info';;
}])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    $rootScope.title = 'Profile';

}])

.controller('SettingsController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    $rootScope.title = 'Settings';

}])

.controller('MessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function($rootScope, $scope, $state, chatData, $location) {
    // $rootScope.title='John Doe';
    $rootScope.user = {
        nick: 'partho',
        pic: 'http://www.canitinguru.com/image/data/aboutme.jpg'
    }

    // socket 
    var user_session = window.localStorage.getItem('user_session');

    socket.on('connect', function(){
    console.log("connect");
    });


    // sending chat id to recieve messages

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8000/main/user/nick',
        data: {
            'chatId': chatData.chatId,

        },
        success: function(response) {
            console.log(response)
        },
        error: function(response) {
            // console.log(response)
        }
    })
    $scope.messages = [{
        nick: 'partho',
        message: 'hello world',
        time: '15:30pm',
        msg_id: 'p314'
    }, {
        nick: 'pragati',
        message: 'bol world',
        time: '18:30pm',
        msg_id: 'u232'
    }];


    $scope.newMessageText = '';

    $scope.send = function() {
        var time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            minute: 'numeric'
        });


        var newMessage = {
            user: $rootScope.user.nick,
            message: $scope.newMessageText,
            chat_id: '',
            nick: $rootScope.user.nick,
            time: time,
            sent: false,
            msg_id: uuid.v4(),
            user_session:user_session
        }

        console.log(newMessage);
        $scope.messages.push(newMessage);
        var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
        $('.chat-screen').scrollTop(scrollTop)
//        console.log(scrollTop)
        $scope.newMessageText = '';


        socket.emit('send_message', newMessage);


        // $.ajax({
        //     method: 'POST',
        //     url: baseUrl +chatUrl+ '/main/user/message',
        //     data: newMessage,
        //     success: function(response) {
        //         // var respMessage={
        //         //  text:$scope.newMessageText,
        //         //  nick: $rootScope.user.nick,
        //         //  pic: $rootScope.user.pic,
        //         //  time: time,
        //         //  msg_id:'iu99',
        //         //  sent:false
        //         // }
        //         var respMessage = response;
        //         for (var i = $scope.messages.length - 1; i >= 0; i--)
        //             if ($scope.messages[i].msg_id == respMessage.msg_id)
        //                 $scope.messages[i].sent = true
        //     },
        //     error: function(response) {
        //         Materialize.toast(response.message, 1000);
        //     }
        // })
    }

}])


.controller('SidebarController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

}])
