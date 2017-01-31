'use strict';

var globalVar;

var baseUrl = 'http://172.17.45.40:8001'
;
var socket = io.connect('172.17.45.40', {
  port: 4000
});
var API_KEY = 'AIzaSyDOCdq5yBdwwuE6A5H4RLxWe_34fEY6WDk';
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


  $rootScope.sendCurrLocNoMap = function () {
    var pos;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var data = {
          lat: pos.lat,
          longitude: pos.lng,
          session_key: window.localStorage.getItem('session_key')

        }
        $.ajax({
          method: 'POST',
          url: baseUrl + '/main/user/location/',
          data: data,
          success: function (response) {
            if (response.status == 1)
              return pos;
            else
              Materialize.toast('Please Enable Location Services')
          }
        })
      }, function () {
          Materialize.toast('Please enable loaction services', 3000);
        }, {timeout: 2000});
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

  $scope.logout = function(){
      window.localStorage.clear();
  }


  $scope.anonymousTrigger = function(){
    $.ajax({
      method:'POST',
      url:baseUrl + '/main/user/anonymous/',
      data:{
        session_key:window.localStorage.getItem('session_key')
      },
      success:function(response){
        Materialize.toast(response.message,1000);
        if(response.status==1)
            console.log('Yo')
           // update nicks
      },
      error:function(response){
        Materialize.toast(response.message,1000);

      }
    })
  }
  
  

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
          $state.go('app.profile_pic');
          window.localStorage.setItem('session_key', response.session_key);
          window.localStorage.setItem('loggedIn', true);

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
          window.localStorage.setItem('nick', response.nick);
          window.localStorage.setItem('pic', response.pic);
          window.localStorage.setItem('session_key', response.session_key);
          window.localStorage.setItem('loggedIn', true);
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
        if (response.status == 1) {
          window.localStorage.setItem('nick', data.nick);

          $state.go('app.interests');
        }
        Materialize.toast(response.message, 1000)

      },
      error: function (response) {}
    })
  }

}])


.controller('LocationController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {

  var data = [];



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

    var pos;

    $rootScope.getCurrLoc = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          pos = {
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
        }, {timeout: 2000});
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

        var me = this;
        var img = document.createElement("img");
        img.src = this.imageSrc;
        div.appendChild(img);
        google.maps.event.addDomListener(div, "click", function (event) {
          google.maps.event.trigger(me, "click");
          console.log(me.latlng_.lat(), me.latlng_.lng());
          $('.modal').modal();
          $scope.locModal = {
            lat: me.latlng_.lat(),
            lng: me.latlng_.lng(),
            nick: me.nick,
            pic: me.imageSrc,
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
    method: 'POST',
    url: baseUrl + '/main/user/get_nearby/',
    data: {
      'session_key': window.localStorage.getItem('session_key')
    },
    success: function (response) {
      if (response.status == 1) {
        data = response.nearby_users;
        for (var i = 0; i < data.length; i++) {
          console.log(data[i], $rootScope.CustomMarker);
          if (data[i].nick != window.localStorage.getItem('nick'))
            new $rootScope.CustomMarker(new google.maps.LatLng(data[i].lat, data[i].longitude), map, baseUrl+data[i].pic, data[i].nick, data[i].distance)
        }

      } else
        Materialize.toast('Cannot Fetch Nearby Users', 1000)
    },
    error: function () {
      Materialize.toast('Cannot Fetch Nearby Users', 1000)

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
  $scope.chats;
  $scope.baseUrl=baseUrl;
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
  $scope.groups = [];
  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_groups/',
    data: {
      session_key: window.localStorage.getItem('session_key')
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
    chatData.chatId = el.group.group_name;
    chatData.chatUrl = '/groups';
    $state.go('app.group_message');
    $rootScope.title = el.group.group_name;
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
  $scope.profile;
  
  $.ajax({
        method:'POST',
        url:baseUrl+'/main/user/profile/',
        data:{
          'session_key': window.localStorage.getItem('session_key')
        },
        contentType: false,
        processData: false,
        success:function(response){
          if(response.status == 1){
          console.log(response);
          }
        },
        error:function(response){
          Materialize.toast('Cannot load profile',1000);

        }
      })
  
}])

.controller('SettingsController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

  $rootScope.title = 'Settings';

}])

.controller('MessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  // $rootScope.title='John Doe';
  $scope.messages;


  $scope.user = {};
  $scope.user.nick = window.localStorage.getItem('nick');
  var chatScreen=document.getElementsByClassName('chat-screen')[0];

  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get/indi_chat/',
    data: {
      'nick': chatData.chatId,
      'session_key': window.localStorage.getItem('session_key')

    },
    success: function (response) {
      for (var i = 0; i < response.messages.length; i++) {
        response.messages[i].nick = response.messages[i].nick_name;
      }
      $scope.messages = response.messages;
      $scope.$apply();
      chatScreen.scrollTop=$('.message-wrapper').outerHeight()*response.messages.length
    },
    error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
    }
  })


  $scope.newMessageText = '';
  var newMessage;
  $scope.send = function () {
    if ($scope.newMessageText != '') {
      var time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      });

      newMessage = {
        message: $scope.newMessageText,
        nick: window.localStorage.getItem('nick'),
        nick_name: chatData.chatId,
        time: time,
        // sent: false,
        msg_id: uuid.v4(),
        session_key: window.localStorage.getItem('session_key')
      }

      // $scope.messages.push(newMessage);
      console.log($scope.messages);
      // var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
      // $('.chat-screen').scrollTop(scrollTop)
        //        console.log(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message_indi', newMessage);


    }
  }


socket.on('send_message_indi', function(data) {
      
        if(chatData.chatId==data.nick_name){
              $scope.messages.push(data);
               $scope.$apply();
               chatScreen.scrollTop+=$('.message-wrapper').outerHeight();

        }

      });

}])

.controller('GroupMessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
 $scope.messages = [];


  $scope.user = {};
  $scope.user.nick = window.localStorage.getItem('nick');

  var chatScreen=document.getElementsByClassName('chat-screen')[0];

  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/room/get/'+chatData.chatId+'/',
    data: {
      'session_key': window.localStorage.getItem('session_key')

    },
    success: function (response) {
      console.log(response)
      for (var i = 0; i < response.messages.length; i++) {
        response.messages[i].nick = response.messages[i].nick_name;
      }
      $scope.messages = response.messages;
      $scope.$apply();
      chatScreen.scrollTop=$('.message-wrapper').outerHeight()*response.messages.length


    },
    error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
    }
  })


  $scope.newMessageText = '';
  var newMessage;
  $scope.send = function () {
    if ($scope.newMessageText != '') {
      var time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      });

      newMessage = {
        message: $scope.newMessageText,
        nick: window.localStorage.getItem('nick'),
        group_name: chatData.chatId,
        time: time,
        // sent: false,
        msg_id: uuid.v4(),
        session_key: window.localStorage.getItem('session_key')
      }

      // $scope.messages.push(newMessage);
      console.log(newMessage);
      var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
      $('.chat-screen').scrollTop(scrollTop)
        //        console.log(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message_group', newMessage);


    }
  }


socket.on('send_message_group', function(data) {
      
        if(chatData.chatId==data.group_name){
              $scope.messages.push(data);
               $scope.$apply();
               chatScreen.scrollTop+=$('.message-wrapper').outerHeight();
               
        }

      });

}])

.controller('InterestsController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $rootScope.title = 'Interests';

    $scope.submit = function () {

      var data = {};
      data.interest = '';
      var checkBox = $('#interests-form input:checked');
      for (var i = 0; i < checkBox.length; i++) {
        data.interest += checkBox[i].value + ',';
      }
      data['session_key'] = window.localStorage.getItem('session_key')
      $.ajax({
        method: 'POST',
        url: baseUrl + '/main/user/interests/',
        data: data,
        success: function (response) {
          if (response.status == 1) {
            addToChatRoom();
          } else
            Materialize.toast('Try Again', 1000);
        },
        error: function (response) {
          Materialize.toast('Try Again', 1000);
        }
      })
    }


    function addToChatRoom() {
      $.ajax({
        method: 'POST',
        url: baseUrl + '/main/user/add_chatroom/',
        data: {
          'session_key': window.localStorage.getItem('session_key')
        },
        success: function (response) {
          if (response.status == 1)
            $state.go('app.groups');
          else
            Materialize.toast('Try Again', 1000);
        },
        error: function (response) {
          Materialize.toast('Try Again', 1000);
        }
      })
    }

}])
  .controller('SidebarController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

}])
  .controller('ProfilePicController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
   $rootScope.sendCurrLocNoMap();

  $rootScope.title = 'Upload Profile Picture';
   //  $scope.profilePic;

   $scope.submit = function(){
      var file  = document.querySelector('input#profile-pic-upload').files[0];
      var session_key = window.localStorage.getItem('session_key')
      var formData = new FormData();
      formData.append('session_key',session_key);
      formData.append('dpic',file);
      console.log(formData.getAll('dpic'))
      $.ajax({
        method:'POST',
        url:baseUrl+'/main/user/profile_pic/',
        data:formData,
        contentType: false,
        processData: false,
        success:function(response){
          Materialize.toast(response.message,1000);
          if(response.status == 1){
            $state.go('app.nick');
            window.localStorage('profile_pic',file);
          }
        },
        error:function(response){
          Materialize.toast('Try Again',1000);

        }
      })
   }

}])