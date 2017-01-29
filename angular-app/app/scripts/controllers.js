'use strict';

var globalVar;

var baseUrl = 'http://52.11.141.223/:8001';
var socket = io.connect('52.11.141.223', {
  port: 4000
});
var API_KEY = 'AIzaSyD1vavahTgsUfM8rCzLseEPCj5mzs9F6o0';
//console.log(io);
//var socket = io();
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
        session_key:window.localStorage.getItem('session_key')
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
          window.localStorage.setItem('session_key', response.session_key);
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


      $scope.submit = function () {

        $.ajax({
          method: 'POST',
          url: baseUrl + '/main/accounts/login/',
          data: $scope.user,
          success: function (response) {
            if (response.status == 1) {
                 window.localStorage.setItem('nick',response.nick);
                 window.localStorage.setItem('pic',response.pic);
                 window.localStorage.setItem('session_key',response.session_key);
              $state.go('app.chats');
              
              
              
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
      // $scope.user.nick = 'parthosa';

    $scope.submit = function () {

      var data = {
        nick: $scope.user.nick,
        session_key: window.localStorage.getItem('session_key')
    }
        $.ajax({
          method: 'POST',
          url: baseUrl + '/main/user/nick/',
          data: data,
          success: function (response) {
            if (response.status == 1){
              window.localStorage.setItem('nick',data.nick);
        
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


.controller('LocationController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {

    var data=[];



  $scope.sendLoc;
  $scope.locModal;

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

    $rootScope.CustomMarker = function (latlng, map, imageSrc, nick, distance) {
      this.nick = nick;
      this.distance = distance;
      this.latlng_ = latlng;
      this.imageSrc = imageSrc;
      this.setMap(map);
      markers.push(this);
    }

    $rootScope.CustomMarker.prototype = new google.maps.OverlayView();

    $rootScope.CustomMarker.prototype.draw = function () {
      // Check if the div has been created.
      var div = this.div_;
      if (!div) {
        // Create a overlay text DIV
        div = this.div_ = document.createElement('div');
        // Create the DIV representing our $rootScope.CustomMarker
        div.className = "customMarker"

        var me=this;
        var img = document.createElement("img");
        img.src = this.imageSrc;
        div.appendChild(img);
        google.maps.event.addDomListener(div, "click", function (event) {
          google.maps.event.trigger(me, "click");
          console.log(me.latlng_.lat(), me.latlng_.lng());
          $('.modal').modal();
          $scope.locModal = {
            lat:me.latlng_.lat(),
    lng:me.latlng_.lng(),
    nick:me.nick,
    pic:me.imageSrc,
    distance: me.distance
          }
          console.log($scope.locModal);
          $scope.$apply();
          $('.modal').modal('open');
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

    $rootScope.CustomMarker.prototype.remove = function () {
      // Check if the overlay was on the map and needs to be removed.
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    $rootScope.CustomMarker.prototype.getPosition = function () {
      return this.latlng_;
    };

    // var data = [{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.365, 75.57],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.37, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.36, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.39, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // }]

   
    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

    $rootScope.getCurrLoc();
    

  }

  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


  initMap();


  $.ajax({
    method:'POST',
    url:baseUrl+'/main/user/get_nearby/',
    data:{
        'session_key':window.localStorage.getItem('session_key')
    },
    success:function(response){
        if(response.status==1){
            data=response.nearby_users;
            for (var i = 0; i < data.length; i++) {
                console.log(data[i],$rootScope.CustomMarker);
                if(data[i].nick!=window.localStorage.getItem('nick'))
                      new $rootScope.CustomMarker(new google.maps.LatLng(data[i].lat, data[i].longitude), map, data[i].pic, data[i].nick, data[i].distance)
            }

        }

        else
            Materialize.toast('Cannot Fetch Nearby Users',1000)
    },
    error:function(){
            Materialize.toast('Cannot Fetch Nearby Users',1000)

    }
 })



    $scope.redirect = function (el) {
      console.log(chatData);
    chatData.chatId = el.locModal.nick;
    chatData.chatUrl = '/users';
      $('#modal').modal('close');
    $state.go('app.message');
    $rootScope.title = el.locModal.nick;
    $rootScope.chatPic = el.locModal.pic;
    //            console.log($rootScope.title);
  }
    
}])


.controller('ChatController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {
  $scope.chats ;

$.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_chat_list/',
    data: {
      session_key: window.localStorage.getItem('session_key')
  },
  success: function (response) {
      $scope.chats = response.peers;
      $scope.$apply();
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
  $scope.groups =[];
$.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_groups/',
    data: {
      session_key:window.localStorage.getItem('session_key')
  },
  success: function (response) {
      $scope.groups = response.groups;
       $scope.$apply();
      console.log($scope.groups);
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
  $scope.messages =[];


$scope.user={};
$scope.user.nick=window.localStorage.getItem('nick');

$.ajax({
    method: 'POST',
    url: baseUrl+'/main/user/get/indi_chat/',
    data: {
      'nick': chatData.chatId,
      'session_key':window.localStorage.getItem('session_key')

  },
  success: function (response) {
      for(var i=0;i<response.messages.length;i++){
        response.messages[i].nick=response.messages[i].nick_name;
      }
      $scope.messages = response.messages;
       $scope.$apply();
      console.log($scope.messages);
  },
  error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
  }
})


$scope.newMessageText = '';
 var newMessage;
$scope.send = function () {
    if( $scope.newMessageText!=''){
    var time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric'
  });

  newMessage = {
      message: $scope.newMessageText,
      nick:window.localStorage.getItem('nick'),
      nick_name: chatData.chatId,
      time: time,
      // sent: false,
      msg_id: uuid.v4(),
      session_key:window.localStorage.getItem('session_key')
  }

  // $scope.messages.push(newMessage);
  console.log($scope.messages);
  var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
  $('.chat-screen').scrollTop(scrollTop)
      //        console.log(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message_indi', newMessage);


  }
}

socket.on('send_message_indi', function(data) {
        // console.log(message)
        //Escape HTML characters
        // var data = message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

        // var otherMessage = false;
        // for(var i=0;i<$scope.messages.length;i++){
        //     if($scope.messages[i].msg_id==data.msg_id){
        //         $scope.messages[i].sent=true;
        //         otherMessage = true;
        //     }

        // }
        // if(otherMessage)
      $scope.messages.push(data);
       $scope.$apply();
        
        // //Append message to the bottom of the list
        // $('#comments').append('<li>' + data + '</li>');
        // window.scrollBy(0, 10000000000);
        // entry_el.focus();
      });

}])

.controller('GroupMessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  // $rootScope.title='John Doe';
  $scope.messages = [];


var session_key = window.localStorage.getItem('session_key');

$.ajax({
    method: 'POST',
    url: baseUrl+'/main/user/get_group/chat/',
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
      session_key: session_key
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
        data['session_key']=window.localStorage.getItem('session_key')
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
                'session_key':window.localStorage.getItem('session_key')
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