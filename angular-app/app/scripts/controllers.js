'use strict';

var globalVar;

var baseUrl = 'http://172.17.45.40:8001';
var socket = io.connect('172.17.45.40', {
  port: 4000
});
var map;

angular.module('latchApp')

.controller('MainController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {

  $rootScope.isActive = function (arg) {
    if ($state.current.url == arg) {
      //                console.log($state);
      return true;
  } else
  return false;
}


$rootScope.sendCurrLocNoMap = function(){
   var pos;
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
       pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
   
    var data = {
        lat:pos.lat,
        longitude:pos.lng,
        session_key:window.localStorage.getItem('user_session')
    }
    $.ajax({
        method:'POST',
        url:baseUrl+'/main/user/location/',
        data:data,
        success:function(response){
            if(response.status == 1)
                return pos;
            else
                Materialize.toast('Please Enable Location Services')
        }
    })
     });
}
};

$(".button-collapse").sideNav();

$rootScope.search = {
    visible: false,
    query: '',
    toggle: function () {
      $rootScope.search.visible = true;
      setTimeout(function () {
        $('#search')[0].focus();
    }, 300);
  },
  close: function () {
      $rootScope.search.visible = false;
      $rootScope.search.query = '';
  }
};

}])

    .controller('SampleController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
      $scope.data = 'abc';
      $scope.array = [1, 2, 3, 4];
  }])

    .controller('RegisterController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {

      $rootScope.title = 'Register';
  //    $rootScope.back = function() {
  //        $state.go('app');
  //    }

  $scope.user = {};
  $scope.user.name = 'partho';
  $scope.user.contact = 'hell.partho@gmail.com';
  $scope.user.password = 'tech';
  $scope.user.confirm_password = 'tech';

  $scope.submit = function () {
    // $location.path('/chats');

    $.ajax({
      method: 'POST',
      url: baseUrl + '/main/accounts/register/',
      data: $scope.user,
      type: 'jsonp',
      success: function (response) {
        if (response.status == 1) {
          $state.go('app.nick');
          window.localStorage.setItem('user_session', response.user_session);
      }

      Materialize.toast(response.message, 1000)

  },
  error: function (response) {
    console.log(response)
}
})
}
}])

    .controller('LoginController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {
      $rootScope.title = 'Login';

      $scope.user = {};
      $scope.user.contact = 'hell.partho@gmail.com';
      $scope.user.password = 'tech';

      $scope.submit = function () {

        $.ajax({
          method: 'POST',
          url: baseUrl + '/main/accounts/login/',
          data: $scope.user,
          success: function (response) {
            if (response.status == 1) {
              $state.go('app.chats');
              window.localStorage.setItem('user_session', response.user_session);
          } else
          Materialize.toast(response.message, 1000)

      },
      error: function (response) {}
  })
    }

}])

    .controller('NickController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {
      $rootScope.title = 'Nick';

      $scope.user = {};
      $scope.user.nick = 'parthosa';

    $scope.submit = function () {

      var data = {
        nick: $scope.user.nick,
        session_key: window.localStorage.getItem('user_session')
    }
        $.ajax({
          method: 'POST',
          url: baseUrl + '/main/user/nick/',
          data: data,
          success: function (response) {
            if (response.status == 1){
              var curLoc=$rootScope.sendCurrLocNoMap();
              console.log(curLoc);
              $state.go('app.interests');
          }
          Materialize.toast(response.message, 1000)

      },
      error: function (response) {}
  })
    }

}])

    .controller('LocationController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {



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

    var markers = [];
//    = locations.map(function (location, i) {
//      var marker = new google.maps.Marker({
//        position: location,
//        label: labels[i % labels.length]
//      });
//      marker.setMap(map);
//      google.maps.event.addListener(marker, "click", function (event) {
//        console.log(this.position.lat());
//        console.log(this.position.lng());
//      });
//      return marker;
//    });

    // Create marker
    //        function genMarker(location) {
    //          var marker = new new google.maps.Marker({
    //                position: location,
    //                label: lo
    //            });
    //        }

    function CustomMarker(latlng, map, imageSrc) {
      this.latlng_ = latlng;
      this.imageSrc = imageSrc;
      this.setMap(map);
      markers.push(this);
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function () {
      // Check if the div has been created.
      var div = this.div_;
      if (!div) {
        // Create a overlay text DIV
        div = this.div_ = document.createElement('div');
        // Create the DIV representing our CustomMarker
        div.className = "customMarker"

        var me=this;
        var img = document.createElement("img");
        img.src = this.imageSrc;
        div.appendChild(img);
        google.maps.event.addDomListener(div, "click", function (event) {
          google.maps.event.trigger(me, "click");
          sendLoc(me.latlng_.lat(), me.latlng_.lng());
      });

        // Then add the overlay to the DOM
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

      // Position the overlay 
      var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarker.prototype.remove = function () {
      // Check if the overlay was on the map and needs to be removed.
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

CustomMarker.prototype.getPosition = function () {
  return this.latlng_;
};

var data = [{
  profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
  pos: [28.365, 75.57],
  kmsAway: 5,
  nick: 'bug'
},{
  profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
  pos: [28.37, 75.58],
  kmsAway: 5,
  nick: 'bug'
},{
  profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
  pos: [28.36, 75.58],
  kmsAway: 5,
  nick: 'bug'
},{
  profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
  pos: [28.39, 75.58],
  kmsAway: 5,
  nick: 'bug'
}]

for (var i = 0; i < data.length; i++) {
  new CustomMarker(new google.maps.LatLng(data[i].pos[0], data[i].pos[1]), map, data[i].profileImage)
}

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

    $rootScope.getCurrLoc();

}

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//  var locations = [{lat:28.36, lng: 75.58}];
//  var locations = [{
//        lat: 28.38,
//        lng: 75.57
//      }, {
//        lat: 28.37,
//        lng: 75.58
//      }, {
//        lat: 28.36,
//        lng: 75.58
//      }, {
//        lat: 28.39,
//        lng: 75.58
//  }];

var sampleLocData = [
{
  position: new google.maps.LatLng(28.365, 75.57),
  pic: 'https://avatars3.githubusercontent.com/u/10223953',
}
]

initMap();

function sendLoc(lat,long){
    $.ajax({
        method:'POST',
        url:baseUrl+'/main/user/location',
        data:data,
        function(response){

        }

    })
}

}])

.controller('HeaderSmallController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
  // $scope.title = 'Hello';
}])

.controller('ChatController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {
  $scope.chats = [{
    nick: 'Partho',
    pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
    location: 'Pilani'

}, {
    nick: 'amritanshu',
    pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
    location: 'Pilani'

}, {
    nick: 'Partho',
    pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
    location: 'Pilani'

}];

$.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_chat_list/',
    data: {
      session_key: window.localStorage.getItem('user_session')
  },
  success: function (response) {
      $scope.chats = response.peers;
  },
  error: function (response) {
      Materialize.toast('Could Not Fetch Chat List', 1000);
  }
})

$scope.redirect = function (el) {
    chatData.chatId = el.chat.nick;
    chatData.chatUrl = '/users';
    $state.go('app.message');
    $rootScope.title = el.chat.nick;
    $rootScope.chatPic = el.chat.pic;
    //            console.log($rootScope.title);
}

}])


.controller('GroupController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {
  $scope.groups = [{
    group_name:'chut',
    pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
    members: '3'
}, {
    group_name:'chut',
    pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
    members: '7'
}, {
    group_name:'chut',
    pic: 'https://s-media-cache-ak0.pinimg.com/564x/28/83/d5/2883d56f655c6f2f262465069957d804.jpg',
    members: '8'
}];

$.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_groups/',
    data: {
      session_key: window.localStorage.getItem('user_session')
  },
  success: function (response) {
      $scope.groups = response.groups;
  },
  error: function (response) {
      Materialize.toast('Could Not Fetch Groups List', 1000);
  }
})

$scope.redirect = function (el) {
    chatData.chatId = el.group.nick;
    chatData.chatUrl = '/groups';
    $state.go('app.group_message');
    $rootScope.title = el.group.nick;
    $rootScope.chatPic = el.group.pic;
    //            console.log($rootScope.title);
}
}])

.controller('GroupInfoController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
  // $rootScope.title = 'Group Info';
  // $rootScope.chatPic = 'image/batman.png';
  $scope.members = [
  {
      nick: 'partho',
      pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
      distance: 3400
  }, {
      nick: 'amritanshu',
      pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
      distance: 3220
  }, {
      nick: 'suvigya',
      pic: 'http://www.canitinguru.com/image/data/aboutme.jpg',
      distance: 3811
  }
  ]

  // $.ajax({
  //     method: 'POST',
  //     url: 'http://localhost:8000/main/user/get_chat/',
  //     data: {
  //         'group_name': chatData.chatId,
  //     },
  //     success: function(response) {
  //          $scope.members = response.members
  //     },
  //     error: function(response) {
  //        Materialize.toast('Could Not Fetch Group Members',1000)
  //     }
  // })
}])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

  $rootScope.title = 'Profile';

}])

.controller('SettingsController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

  $rootScope.title = 'Settings';

}])

.controller('MessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  // $rootScope.title='John Doe';
  $scope.messages = [];
  $rootScope.user = {
    nick: 'partho',
    pic: 'http://www.canitinguru.com/image/data/aboutme.jpg'
}

var user_session = window.localStorage.getItem('user_session');

$.ajax({
    method: 'POST',
    url: 'http://localhost:8000/main/user/get_chat/',
    data: {
      'nick': chatData.chatId,
  },
  success: function (response) {
      $scope.messages = response.messages
  },
  error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
  }
})


$scope.newMessageText = '';

$scope.send = function () {
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
      pic: $rootScope.user.pic,
      time: time,
      sent: false,
      msg_id: uuid.v4(),
      user_session: user_session
  }

  $scope.messages.push(newMessage);
  var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
  $('.chat-screen').scrollTop(scrollTop)
      //        console.log(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message', newMessage);


  }

}])

.controller('GroupMessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  // $rootScope.title='John Doe';
  $scope.messages = [];
  $rootScope.user = {
    nick: 'partho',
    pic: 'http://www.canitinguru.com/image/data/aboutme.jpg'
}

var user_session = window.localStorage.getItem('user_session');

$.ajax({
    method: 'POST',
    url: 'http://localhost:8000/main/user/get_group/chat/',
    data: {
      'group_name': chatData.chatId,
  },
  success: function (response) {
      $scope.messages = response.messages
  },
  error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
  }
})


$scope.newMessageText = '';

$scope.send = function () {
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
      user_session: user_session
  }

  $scope.messages.push(newMessage);
  var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
  $('.chat-screen').scrollTop(scrollTop)
      //        console.log(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message', newMessage);


  }

}])

.controller('InterestsController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    $rootScope.title='Interests';

    $scope.submit = function(){

        var data = {};
        data.interest='';
        var checkBox=$('#interests-form input:checked');
        for(var i=0;i<checkBox.length;i++){
            data.interest+=checkBox[i].value+',';
        }
        data['session_key']=window.localStorage.getItem('user_session')
        $.ajax({
            method:'POST',
            url:baseUrl + '/main/user/interests/',
            data:data,
            success:function(response){
                if(response.status==1){
                    addToChatRoom();
                }
                else
                    Materialize.toast('Try Again',1000);
            },
            error:function(response){
                Materialize.toast('Try Again',1000);
            }
        })
    }


    function addToChatRoom(){
        $.ajax({
            method:'POST',
            url:baseUrl+'/main/user/add_chatroom/',
            data:{
                'session_key':window.localStorage.getItem('user_session')
            },
            success:function(response){
             if(response.status==1)
                $state.go('app.groups');
             else
                    Materialize.toast('Try Again',1000);
            },
            error:function(response){
                Materialize.toast('Try Again',1000);
            }
        })
    }

}])
.controller('SidebarController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

}])