'use strict';

var globalVar, blah;

var baseUrl = 'http://127.0.0.1:8001';
var globalVar;
var socket = io.connect('127.0.0.1', {
  port: 4000
});

//var socket = io();
var map;

angular.module('latchApp')

.controller('MainController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {

  $rootScope.isActive = function (arg) {
    if ($state.current.url == arg) {
      return true;
    } else
      return false;
  }

  $rootScope.baseUrl = baseUrl;
  $rootScope.chats = [];
  $rootScope.groups = [];
  $rootScope.user = {};
  $rootScope.user.pic = window.localStorage.getItem('pic');
  $rootScope.user.nick = window.localStorage.getItem('nick');




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
        Materialize.toast('Please enable location services', 3000);
      }, {
        timeout: 2000
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

  $scope.logout = function () {
    db.delete();
    window.localStorage.clear();
  }

  //
  //  $scope.anonymousTrigger = function(){
  //    $.ajax({
  //      method:'POST',
  //      url:baseUrl + '/main/user/anonymous/',
  //      data:{
  //        session_key:window.localStorage.getItem('session_key')
  //      },
  //      success:function(response){
  //        Materialize.toast(response.message,1000);
  //        if(response.status==1)
  //            console.log('Yo')
  //           // update nicks
  //      },
  //      error:function(response){
  //        Materialize.toast(response.message,1000);
  //
  //      }
  //    })
  //  }
  //

  //  $scope.anonymousTrigger = function(){
  //    $.ajax({
  //      method:'POST',
  //      url:baseUrl + '/main/user/anonymous/',
  //      data:{
  //        session_key:window.localStorage.getItem('session_key')
  //      },
  //      success:function(response){
  //        Materialize.toast(response.message,1000);
  //        // if(response.status==1)
  //           // update nicks
  //      },
  //      error:function(response){
  //        Materialize.toast(response.message,1000);
  //
  //      }
  //    })
  //  }
  //
  //
  //  


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
    try{
    window.plugins.spinnerDialog.show(null,"Please Wait", true);}
    catch(err){}
    $.ajax({
      method: 'POST',
      url: baseUrl + '/main/accounts/register/',
      data: $scope.user,
      type: 'jsonp',
      success: function (response) {
        if (response.status == 1) {

           db.version(1).stores({
            indi_chat: 'nick, pic, distance, messages',
            group_chat: 'group_name, members, pic, messages, mem_info',
            chat_bot: 'nick,message'
          });

          $state.go('app.profile_pic');
          window.localStorage.setItem('session_key', response.session_key);
          window.localStorage.setItem('loggedIn', true);
          window.localStorage.setItem('name', $scope.user.name);
          window.localStorage.setItem('contact', $scope.user.contact);
          pushNotification();

        }
        try{
        window.plugins.spinnerDialog.hide();}
        catch(err){}
        Materialize.toast(response.message, 1000)

      },
      error: function (response) {
        try{
        window.plugins.spinnerDialog.hide();}
        catch(err){}
      }
    })
  }
}])

.controller('LoginController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {
  $rootScope.title = 'Login';

  $scope.user = {};


  $scope.submit = function () {
    try{
    window.plugins.spinnerDialog.show(null,"Please Wait", true);}
    catch(err){}
    $.ajax({
      method: 'POST',
      url: baseUrl + '/main/accounts/login/',
      data: $scope.user,
      success: function (response) {
        try{
        window.plugins.spinnerDialog.hide();}
        catch(err){}
        if (response.status == 1) {


          db.version(1).stores({
            indi_chat: 'nick, pic, distance, messages',
            group_chat: 'group_name, members, pic, messages, mem_info',
            chat_bot: 'nick,message'
          });


          window.localStorage.setItem('nick', response.nick);
          window.localStorage.setItem('pic', response.pic);
          window.localStorage.setItem('session_key', response.session_key);
          window.localStorage.setItem('loggedIn', true);
          $rootScope.user.pic = response.pic;
          $rootScope.user.nick = response.nick;
          pushNotification();
          // $rootScope.getProfile();
          $state.go('app.chats');


        } else{
          Materialize.toast(response.message, 1000)
        }

      },
      error: function (response) {
        try{
         window.plugins.spinnerDialog.hide();}
         catch(err){}
      }
    })
  }

}])

.controller('NickController', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {
  $rootScope.title = 'Nick';

  $rootScope.sendCurrLocNoMap();
  $scope.user = {};
  // $scope.user.nick = 'parthosa';

  $scope.submit = function () {
    try{
     window.plugins.spinnerDialog.show(null,"Please Wait", true);}
     catch(err){}
    var data = {
      nick: $scope.user.nick,
      session_key: window.localStorage.getItem('session_key')
    }
    $.ajax({
      method: 'POST',
      url: baseUrl + '/main/user/nick/',
      data: data,
      success: function (response) {
        try{
        window.plugins.spinnerDialog.hide();}
        catch(err){}
        if (response.status == 1) {
          window.localStorage.setItem('nick', data.nick);

          $state.go('app.interests');
        }
        Materialize.toast(response.message, 1000)

      },
      error: function (response) {
        try{
        window.plugins.spinnerDialog.hide();}
        catch(err){}
      }
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
              if (response.status != 1)
                Materialize.toast('Please Enable Location Services')
            }
          })



          var marker = new google.maps.Marker({
            position: pos
          });
          map.setCenter(pos);
          marker.setMap(map);
          map.setZoom(13);
        }, function () {
          Materialize.toast('Please enable location services', 3000);
        }, {
          timeout: 2000
        });
      } else {
        Materialize.toast('Please enable location services', 3000);
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
          $('.modal').modal();
          $scope.locModal = {
            lat: me.latlng_.lat(),
            lng: me.latlng_.lng(),
            nick: me.nick,
            pic: me.imageSrc,
            distance: me.distance
          }
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
          if (data[i].nick != window.localStorage.getItem('nick'))
            new $rootScope.CustomMarker(new google.maps.LatLng(data[i].lat, data[i].longitude), map, baseUrl + data[i].pic, data[i].nick, data[i].distance)
        }

      } else
        Materialize.toast('Cannot Fetch Nearby Users', 1000)
    },
    error: function () {
      Materialize.toast('Cannot Fetch Nearby Users', 1000)

    }
  })



  $scope.redirect = function (el) {
    chatData.chatId = el.locModal.nick;
    chatData.chatUrl = '/users';
    $('#modal').modal('close');
    $state.go('app.message');
    $rootScope.title = el.locModal.nick;
    $rootScope.chatPic = el.locModal.pic;
  }

}])
.controller('BotMapController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {

  var data = [];

  var restId = chatData.restId;

  $scope.sendLoc;
  $scope.locModal;


  $scope.reviews = [];

  function initMap() {

    var pos = {
        lat: parseFloat(chatData.lat),
        lng:parseFloat(chatData.long),
      }

var map;
var marker ;

      if(pos.lat != 0 && pos.lng !=0 ){

    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 5,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });


     marker = new google.maps.Marker({
          position: pos
        });
        map.setCenter(pos);
        marker.setMap(map);
        map.setZoom(13);


          marker.addListener('click', function (event) {
          $('.modal').modal();
          $.ajax({
            method:"POST",
            url:baseUrl + "/main/user/restaraunt/reviews/",
            data:{
              id:restId
            },
            success:function (response) {
              console.log(response);
              $.each(response.reviews,function (i,ele) {
                  console.log(ele);
                  $scope.reviews.push(ele);
              })
              $scope.$apply();
            },
            error:function (res,textS,xhr) {
              console.log(res);
            }
          })
          $scope.locModal = {
            lat: pos.lat,
            lng: pos.lng,
            name: $rootScope.title,
            reviews: 'this is good'
          }
          $scope.$apply();
          $('.modal').modal('open');
        });

  }
  else{
 var geocoder = new google.maps.Geocoder();
        var address = chatData.locality +', '+ chatData.city;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map = new google.maps.Map(document.getElementById('map'), {
      center: results[0].geometry.location,
      zoom: 5,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
        marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        map.setZoom(13);

          marker.addListener('click', function (event) {
          $('.modal').modal();

           $.ajax({
            method:"POST",
            url:baseUrl + "/main/user/restaraunt/reviews/",
            data:{
              id:restId
            },
            success:function (response) {
              console.log(response);
               $.each(response.reviews,function (i,ele) {
                  $scope.reviews.push(ele);
              })
               console.log($scope.reviews);
              $scope.$apply();

            }
          })

          $scope.locModal = {
            lat: pos.lat,
            lng: pos.lng,
            name: $rootScope.title,
            reviews: 'this is good'
          }
          $scope.$apply();
          $('.modal').modal('open');
        });


      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

  }



  

  }




  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


  initMap();



  $scope.redirect = function (el) {
    chatData.chatId = el.locModal.nick;
    chatData.chatUrl = '/users';
    $('#modal').modal('close');
    $state.go('app.message');
    $rootScope.title = el.locModal.nick;
    $rootScope.chatPic = el.locModal.pic;
  }

}])


.controller('ChatController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {
  db.indi_chat.each(function (peer) {
    $rootScope.chats.push(peer);
    $scope.$apply();
  })


  if (window.localStorage.getItem('name') == "undefined") {

    $.ajax({
      method: 'POST',
      url: baseUrl + '/main/user/profile/',
      data: {
        'session_key': window.localStorage.getItem('session_key')
      },
      success: function (response) {
        if (response.status == 1) {
          window.localStorage.setItem('pic', response.pic);
          window.localStorage.setItem('nick', response.nick);
          window.localStorage.setItem('name', response.name);
          window.localStorage.setItem('contact', response.contact);
          $rootScope.user.nick = response.nick;
          $rootScope.user.pic = response.pic;
          $rootScope.user.name = response.name;
          $rootScope.user.contact = response.contact;
          $rootScope.$apply();
        } else {
          Materialize.toast('Cannot load profile', 1000);

        }
      },
      error: function (response) {
        Materialize.toast('Cannot load profile', 1000);

      }
    })

  }


  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_chat_list/',
    data: {
      session_key: window.localStorage.getItem('session_key')
    },
    success: function (response) {
      response.peers.map(function (e, i) {
        if (e.messages == undefined)
          e.messages = [];
      })
      db.indi_chat.bulkAdd(response.peers).then(function () {
        $rootScope.chats = [];
        //        console.log(1)
        db.indi_chat.each(function (peer) {
          $rootScope.chats.push(peer);
          $scope.$apply();
        })
      });
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
  }

  $scope.chatBot = function(){
     chatData.chatId = 'Harlie';
    $rootScope.title = 'Harlie';
     $rootScope.chatPic = 'images/johndoe.png';
     $state.go('app.bot_message');
  }

}])

.controller('GroupController', ['$rootScope', '$scope', '$state', '$location', 'chatData', function ($rootScope, $scope, $state, $location, chatData) {

  if ($rootScope.groups.length == 0) {
    db.group_chat.each(function (group) {
      $rootScope.groups.push(group);
      $scope.$apply();
//    console.log($rootScope.groups);
//      console.log(1);
    });
  }

  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/get_groups/',
    data: {
      session_key: window.localStorage.getItem('session_key')
    },
    success: function (response) {
//      response.groups.map(function (e, i) {
////        console.log(e.messages);
//        if (e.messages == undefined)
//          e.messages = [];
//        if (e.mem_info == undefined)
//          e.mem_info = [];
//      })
      db.group_chat.bulkAdd(response.groups).then(function () {
        $rootScope.groups = [];
        db.group_chat.each(function (group) {
          $rootScope.groups.push(group);
          $scope.$apply();
       });
     });
      //      $rootScope.groups = response.groups;
      //      $scope.$apply();
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
  }
}])

.controller('GroupInfoController', ['$rootScope', '$scope', '$state', 'chatData', function ($rootScope, $scope, $state, chatData) {
  // $rootScope.title = 'Group Info';
  // $rootScope.chatPic = 'image/batman.png';

  if ($rootScope.group==undefined)
    $rootScope.group = {members: []};
  db.group_chat.where('group_name').equals(chatData.chatId.toString()).each(function(group) {
    $rootScope.group.members.push(group.mem_info);
    $scope.$apply();
  })

  try{
   window.plugins.spinnerDialog.show(null,"Please Wait", true);}
   catch(err){}
  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/room/' + chatData.chatId + '/get_members/',
    data: {
      'session_key': window.localStorage.getItem('session_key')
    },
    success: function (response) {
      if (response.status == 1) {
          db.group_chat.where('group_name').equals(chatData.chatId.toString()).modify({mem_info: response.members}).then(function (snapshot) {
            $rootScope.group.members = response.members;
            $scope.$apply();
          });
      } else
        Materialize.toast('Could Not Fetch Group Members', 1000);
        try{
       window.plugins.spinnerDialog.hide();}
       catch(err){}
    },
    error: function (response) {
      try{
       window.plugins.spinnerDialog.hide();}
       catch(err){}
      Materialize.toast('Could Not Fetch Group Members', 1000);
    }
  });


  $scope.redirect = function (el) {

    chatData.chatId = el.member.nick;
    $state.go('app.message');
    $rootScope.title = el.member.nick;
  }

}])

.controller('ProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

  $rootScope.title = 'Profile';
  try{
   window.plugins.spinnerDialog.show(null,"Please Wait", true);}
   catch(err){}
  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/user/profile/',
    data: {
      'session_key': window.localStorage.getItem('session_key')
    },
    success: function (response) {
      if (response.status == 1) {
        window.localStorage.setItem('pic', response.pic);
        window.localStorage.setItem('nick', response.nick);
        window.localStorage.setItem('name', response.name);
        window.localStorage.setItem('contact', response.contact);
        $rootScope.user.nick = response.nick;
        $rootScope.user.pic = response.pic;
        $rootScope.user.name = response.name;
        $rootScope.user.contact = response.contact;
        $rootScope.$apply();
      } else {
        Materialize.toast('Cannot load profile', 1000);

      }
      try{
       window.plugins.spinnerDialog.hide();}
       catch(err){}
    },
    error: function (response) {
      Materialize.toast('Cannot load profile', 1000);
      try{
      window.plugins.spinnerDialog.hide();}
      catch(err){}
    }
  })


}])

.controller('SettingsController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

  $rootScope.title = 'Settings';



}])

.controller('MessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  // $rootScope.title='John Doe';
  $scope.messages;
  if ($scope.messages == null)
    $scope.messages = [];

  db.indi_chat.get(chatData.chatId.toString(), function (peer) {
    $scope.messages = peer.messages;
    $scope.$apply();
  })

  $scope.user = {};
  $scope.user.nick = window.localStorage.getItem('nick');
  var chatScreen = document.getElementsByClassName('chat-screen')[0];

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
      db.indi_chat.where('nick').equals(chatData.chatId.toString()).modify({
        messages: response.messages
      }).then(function (snapshot) {
        $scope.messages = response.messages;
        $scope.$apply();
      });
      chatScreen.scrollTop = $('.message-wrapper').outerHeight() * response.messages.length
    },
    error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
    }
  })


  $scope.newMessageText = '';
  var newMessage;

  $scope.enterSend = function (keyEvent) {
    
     if (keyEvent.which === 13)
         $scope.send();
  }

  $scope.send = function () {
    if ($scope.newMessageText != '') {

      var date = new Date();
      date = date.toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      })

      var encodedMessage = $scope.newMessageText;
      console.log(encodedMessage);

      newMessage = {
        message: encodedMessage,
        nick: window.localStorage.getItem('nick'),
        nick_name: chatData.chatId,
        time: date,
        sent: false,
        msg_id: uuid.v4(),
        session_key: window.localStorage.getItem('session_key')
      }

      $scope.messages.push(newMessage);
      newMessage.message = btoa(encodedMessage);
      setTimeout(function () {
        chatScreen.scrollTop += $('.message-wrapper').outerHeight();
      }, 100)

      // var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
      // $('.chat-screen').scrollTop(scrollTop)
      $scope.newMessageText = '';


      socket.emit('send_message_indi', newMessage);


    }
  }


  socket.on('send_message_indi', function (data) {
      console.log(data.message);
      data.message = atob(data.message);
      console.log(data.message);
    if (chatData.chatId == data.nick) {
      $scope.messages.push(data);
      $scope.$apply();
      chatScreen.scrollTop += $('.message-wrapper').outerHeight();
    } else if ($scope.user.nick == data.nick) {
      for (var i = $scope.messages.length - 1; i >= 0; i--) {
        if ($scope.messages[i].msg_id == data.msg_id) {
          $scope.messages[i].sent = true;
          $scope.$apply();
          break;
        }
      }



    } else if(Object.getOwnPropertyNames(data).length > 0)  {
      
      Materialize.toast('New Message from ' + data.nick, 1000);
    }
      dispatchPush(data,true);



  });

}])
.controller('BotMessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
  $rootScope.title='Harlie';
  $scope.messages;
  if ($scope.messages == null)
    $scope.messages = [];

  db.chat_bot.put({
    name:'Harlie',
    message:$scope.messages
    }, function (peer) {
    $scope.messages = peer.messages;
    $scope.$apply();

  })

  $scope.user = {};
  $scope.user.nick = window.localStorage.getItem('nick');
  var chatScreen = document.getElementsByClassName('chat-screen')[0];

  // $.ajax({
  //   method: 'POST',
  //   url: baseUrl + '/main/user/chat/bot/',
  //   data: {
  //     'nick': chatData.chatId,
  //     'session_key': window.localStorage.getItem('session_key')

  //   },
  //   success: function (response) {
  //     for (var i = 0; i < response.messages.length; i++) {
  //       response.messages[i].nick = response.messages[i].nick_name;
  //     }
  //     db.indi_chat.where('nick').equals(chatData.chatId.toString()).modify({
  //       messages: response.messages
  //     }).then(function (snapshot) {
  //       $scope.messages = response.messages;
  //       $scope.$apply();
  //     });
  //     chatScreen.scrollTop = $('.message-wrapper').outerHeight() * response.messages.length
  //   },
  //   error: function (response) {
  //     Materialize.toast('Could Not Fetch Messages', 1000)
  //   }
  // })


  $scope.newMessageText = '';
  var newMessage;
  $scope.enterSend = function (keyEvent) {
    
     if (keyEvent.which === 13)
         $scope.send();
  }

  $scope.send = function () {
    if ($scope.newMessageText != '') {

      var date = new Date();
      date = date.toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      })

      newMessage = {
        message: $scope.newMessageText,
        nick: window.localStorage.getItem('nick'),
        nick_name: chatData.chatId,
        time: date,
        sent: true,
        msg_id: uuid.v4(),
        session_key: window.localStorage.getItem('session_key')
      }


      $scope.messages.push(newMessage);
        // $scope.$apply();

      db.chat_bot.put({
        nick:'Harlie',
        message:newMessage
      })

      

      setTimeout(function () {
      chatScreen.scrollTop = $('.message-wrapper').outerHeight() *  $scope.messages.length
        // chatScreen.scrollTop += $('.message-wrapper').outerHeight();
      }, 100)

      // var scrollTop = $('.chat-screen').scrollTop() + $($('.message-wrapper')[0]).outerHeight()
      // $('.chat-screen').scrollTop(scrollTop)
      $scope.newMessageText = '';

       $.ajax({
      method: 'POST',
      url: baseUrl + '/main/user/chat/bot/',
      data: newMessage,
      success: function (data) {

         if (chatData.chatId == data.nick) {
            if(data['restaurants']){
              
               $scope.messages.push({
                 message: data.message,
                  nick:data.nick,
                  time: data.time
               })

              $.each(data['restaurants'],function (i,ele) {
                  var indi_rest_msg = ele.name + ' \n ' + ele.restaurants.locality + ele.restaurants.city ;
                  $scope.messages.push({
                       message: indi_rest_msg,
                       nick:data.nick,
                       time:data.time,
                       lat:ele.lat,
                       long:ele.long,
                       address:ele.restaurants.address,
                       locality:ele.restaurants.locality,
                       city:ele.restaurants.city,
                       id:ele.id,
                       type:'restaurants'
                  })
              }) 

             
               db.chat_bot.put({
                  nick:'Harlie',
                  message:$scope.messages
                })
            }
            else if(data['hotels']){
              
               $scope.messages.push({
                 message: data.message,
                  nick:data.nick,
                  time: data.time
               })
              $.each(data['hotels'],function (i,ele) {
                  var indi_rest_msg = ele.name + ' \n ' + ele.address;
                  $scope.messages.push({
                       message: indi_rest_msg,
                       nick:data.nick,
                       time:data.time,
                       lat:ele.lat,
                       long:ele.lng,
                       type:'hotels',
                       address:ele.address
                  })
              }) 

               db.chat_bot.put({
                  nick:'Harlie',
                  message:$scope.messages
                })

            }else{

            $scope.messages.push(data);
            }
            $scope.$apply();
             db.chat_bot.put({
                  nick:'Harlie',
                  message:$scope.messages
                })

            chatScreen.scrollTop += $('.message-wrapper').outerHeight();
          } else if ($scope.user.nick == data.nick) {
            for (var i = $scope.messages.length - 1; i >= 0; i--) {
              if ($scope.messages[i].msg_id == data.msg_id) {
                $scope.messages[i].sent = true;
                $scope.$apply();
                break;
              }
            }



          } else if(Object.getOwnPropertyNames(data).length > 0)  {
            
            Materialize.toast('New Message from ' + data.nick, 1000);
          }
            dispatchPush(data,true);



      },
      error:function (response) {

      }
      // socket.emit('send_message_indi', newMessage);


    });
  }
}



$scope.openMap = function (el) {
  if(el.message.type == "restaurants"){
    chatData.lat = el.message.lat;
    chatData.long = el.message.long;
    var sep = el.message.message.indexOf('\n');
    chatData.address = el.message.address;
    chatData.locality = el.message.locality;
    chatData.restId = el.message.id;
    chatData.city = el.message.city;
    $rootScope.title = el.message.message.substr(0,sep);
    $state.go('app.bot_map');
  }
  if(el.message.type == "hotels"){
    chatData.lat = el.message.lat;
    chatData.long = el.message.long;
    chatData.address = el.message.address;
        var sep = el.message.message.indexOf('\n');
    $rootScope.title = el.message.message.substr(0,sep);
    $state.go('app.bot_map');
  }
}

}])

.controller('GroupMessageController', ['$rootScope', '$scope', '$state', 'chatData', '$location', function ($rootScope, $scope, $state, chatData, $location) {
//  $scope.messages;
  
  if ($scope.messages == undefined)
    $scope.messages = [];

  db.group_chat.get(chatData.chatId.toString(), function (group) {
    $scope.messages = group.messages;
    $scope.$apply();
  })

  $scope.user = {};
  $scope.user.nick = window.localStorage.getItem('nick');

  var chatScreen = document.getElementsByClassName('chat-screen')[0];

  $.ajax({
    method: 'POST',
    url: baseUrl + '/main/room/get/' + chatData.chatId + '/',
    data: {
      'session_key': window.localStorage.getItem('session_key')

    },
    success: function (response) {
      for (var i = 0; i < response.messages.length; i++) {
        response.messages[i].nick = response.messages[i].nick_name;
      }
      db.group_chat.where('group_name').equals(chatData.chatId.toString()).modify({
        messages: response.messages
      }).then(function (snapshot) {
        $scope.messages = response.messages;
        $scope.$apply();
      })
      chatScreen.scrollTop = $('.message-wrapper').outerHeight() * response.messages.length


    },
    error: function (response) {
      Materialize.toast('Could Not Fetch Messages', 1000)
    }
  })


  $scope.newMessageText = '';
  var newMessage;

  $scope.enterSend = function (keyEvent) {
    
     if (keyEvent.which === 13)
         $scope.send();
  }


  $scope.send = function () {
    if ($scope.newMessageText != '') {
      var date = new Date();
      date = date.toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      })

      var encodedMessage = $scope.newMessageText;
      console.log(encodedMessage);
      
      newMessage = {
        message: encodedMessage,
        nick: window.localStorage.getItem('nick'),
        group_name: chatData.chatId,
        time: date,
        sent: false,
        msg_id: uuid.v4(),
        session_key: window.localStorage.getItem('session_key')
      }

      $scope.messages.push(newMessage);
      setTimeout(function () {
        chatScreen.scrollTop += $('.message-wrapper').outerHeight();
      }, 100)
      newMessage.message = btoa(encodedMessage);
      $scope.newMessageText = '';


      socket.emit('send_message_group', newMessage);


    }
  }


  socket.on('send_message_group', function (data) {
    console.log(data.message);
    data.message = atob(data.message);
    if (chatData.chatId == data.group_name && $scope.user.nick != data.nick) {
      $scope.messages.push(data);
      $scope.$apply();
      chatScreen.scrollTop += $('.message-wrapper').outerHeight();
    } else if ($scope.user.nick == data.nick) {
      for (var i = $scope.messages.length - 1; i > 0; i--) {
        if ($scope.messages[i].msg_id == data.msg_id) {
          $scope.messages[i].sent = true;
          $scope.$apply();
        }
      }
        }
        else if(Object.getOwnPropertyNames(data).length > 0)  {
          Materialize.toast('New Message in '+data.group_name,1000);
        }
          dispatchPush(data,false);

  });



              }])


            .controller('InterestsController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
              $rootScope.title = 'Interests';

              $rootScope.sendCurrLocNoMap();
              $scope.submit = function () {
                try{
                   window.plugins.spinnerDialog.show(null,"Please Wait", true);}
                   catch(err){}
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
                      try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
                  },
                  error: function (response) {
                    try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
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

            .controller('EditProfileController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
              $rootScope.title = 'Edit Profile';

              $scope.name = window.localStorage.getItem('name');
              $scope.contact = window.localStorage.getItem('contact');
              $scope.nick = window.localStorage.getItem('nick');

              $scope.submit = function () { 
                try{
                   window.plugins.spinnerDialog.show(null,"Please Wait", true);}
                   catch(err){}
                var file  = document.querySelector('input#edit-profile-pic-upload').files[0];
                var session_key = window.localStorage.getItem('session_key')
                var formData = new FormData();
                formData.append('session_key', session_key);
                formData.append('name', $scope.name);
                formData.append('contact', $scope.contact);
                formData.append('nick', $scope.nick);
                  formData.append('session_key', session_key);
                var data = {
                  session_key: session_key,
                  name: $scope.name,
                  contact: $scope.contact,
                  nick: $scope.nick,
                  pic: dataURL
                }
                $.ajax({
                  method: 'POST',
                  url: baseUrl + '/main/user/edit_profile/',
                  data: data,
                  success: function (response) {
                    Materialize.toast(response.message, 1000);
                    if (response.status == 1) {
                      window.localStorage.setItem('pic', response.pic);
                      window.localStorage.setItem('nick', response.nick);
                      window.localStorage.setItem('name', response.name);
                      window.localStorage.setItem('contact', response.contact);
                      $rootScope.user.nick = response.nick;
                      $rootScope.user.pic = response.pic;
                      $rootScope.user.name = response.name;
                      $rootScope.user.contact = response.contact;
                      $rootScope.$apply();
                      $state.go('app.chats');
                    }
                    try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
                  },
                  error: function (response) {
                    try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
                    Materialize.toast('Try Again', 1000);

                  }
                })
              }
}])
            .controller('PasswordController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
              $rootScope.title = 'Change Password';
              $scope.old_password;
              $scope.new_password;
              $scope.new_password_confirm;

              $scope.submit = function () {
                try{
                   window.plugins.spinnerDialog.show(null,"Please Wait", true);}
                   catch(err){}
                var data = {};
                data['old_password'] = $scope.old_password;
                data['new_password'] = $scope.new_password;
                data['new_password_confirm'] = $scope.new_password_confirm;
                data['session_key'] = window.localStorage.getItem('session_key')
                $.ajax({
                  method: 'POST',
                  url: baseUrl + '/main/user/password/change/',
                  data: data,
                  success: function (response) {
                    if (response.status == 1) {
                      Materialize.toast(response.message, 1000);
                      $state.go('app.chats')
                    } else
                      Materialize.toast(response.message, 1000);
                      try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
                  },
                  error: function (response) {
                    try{
                   window.plugins.spinnerDialog.hide();}
                   catch(err){}
                    Materialize.toast('Try Again', 1000);
                  }
                })
              }
  }])


            .controller('ProfilePicController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

                $rootScope.title = 'Upload Profile Picture';
                //  $scope.profilePic;

                $rootScope.sendCurrLocNoMap();


                $scope.submit = function () { 
                  try{
                     window.plugins.spinnerDialog.show(null,"Please Wait", true);}
                     catch(err){}
                  //    var file  = dataURL;
    var session_key = window.localStorage.getItem('session_key')
    var formData = new FormData();
    //    formData.append('dpic', file);
    //    console.log(formData.getAll('dpic'))

    formData.append('session_key', session_key);

    function dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
      });
    }
//    canvas.toBlob(function (blob) {
      formData.append('dpic', dataURItoBlob(dataURL), uuid.v4()+".png");
//    }, "image/png");
    //                  console.log(dataURL);

    //                  var data = {
    //                    session_key: session_key,
    //                    dpic: dataURL
    //                  }
    if (dataURL != undefined) {
      $.ajax({
        method: 'POST',
        url: baseUrl + '/main/user/profile_pic/',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          Materialize.toast(response.message, 1000);
          try {
            window.plugins.spinnerDialog.hide();
          } catch (err) {}
          if (response.status == 1) {
            $state.go('app.nick');
            window.localStorage.setItem('pic', file);
          }
        },
        error: function (response) {
          try {
            window.plugins.spinnerDialog.hide();
          } catch (err) {}
          Materialize.toast('Try Again', 1000);
        }
      })
    } else Materialize.toast('Please upload a image', 1000);
  }
                }])