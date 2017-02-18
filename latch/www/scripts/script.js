//var baseUrl = 'http://192.168.43.116:8001';

var API_KEY = 'AIzaSyDOCdq5yBdwwuE6A5H4RLxWe_34fEY6WDk';


//$(document).ready(function () {
//
//<<<<<<< HEAD
//  $(document).on('click', function (ev) {
//    console.log((ev.target).closest('#moreOptionsTrigger') != null)
//    var bx = document.getElementById('moreOptions');
//
//    if (bx != null) {
//      if ((ev.target).closest('#moreOptionsTrigger') != null)
//        bx.style.display = 'block'
//=======
//	$(document).on('click',function(ev){
//		var bx=document.getElementById('moreOptions');
//>>>>>>> 775b31d52bed9911216bacfb294cc40c1d9d45f5
//
//      else if ((ev.target).closest('#moreOptions') == null)
//        bx.style.display = 'none'
//
//    }
//  })
//});

$(document).ready(function () {
  Materialize.updateTextFields();
});


function pushNotification(){

  try{



      var push = PushNotification.init({
        android: {
            senderID: "230792734381",
            forceShow:true
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function(data) {
        // alert(data.registrationId);
       
        $.ajax({
            method:"POST",
            url:baseUrl+"/main/user/get_device/",
            data:{
                device_id:data.registrationId,
                session_key:window.localStorage.getItem('session_key')
            },
            success:function (response) {
                // alert('response')
            }
        })
        window.localStorage.setItem('registrationId',data.registrationId);
    });


    push.on('notification', function(data) {
       // console.log('notification event',data);
        navigator.notification.alert(
            'new message',         // message
            null,                 // callback
            'latch',           // title
            'Ok'                  // buttonName
        );
        // alert(data.message);
        // alert('is user: '+data.additionalData['isUser']);
    });

    push.on('error', function(e) {
        alert(e.message);
    });
    
    }
    catch( err) {

    }
}



function dispatchPush(data,isUser){
  url=baseUrl;
  if(isUser)
  {
  $.ajax({
    method:'POST',
    url:baseUrl+'/main/user/indi_notify/',
    data:{
      message:data.message,
      nick:data.nick,
      session_key:window.localStorage.getItem('session_key'),
      isUser:isUser
    },
    success:function (response) {
      console.log("Push Request Sent")
    }
  });
}
  else{
   $.ajax({
    method:'POST',
    url:baseUrl+'/main/user/group_notify/',
    data:{
      message:data.message,
      group_name:data.group_name,
      session_key:window.localStorage.getItem('session_key'),
      isUser:isUser
    },
    success:function (response) {
      console.log("Push Request Sent")
    }
  });
 }

}

document.addEventListener("resume", function(){


}, false);



var dataURL;


function previewFile(canvasId) { 
  var preview = document.querySelector('img#img-preview'); 
  var file   = document.querySelector('input#profile-pic-upload').files[0]; 
  var reader  = new FileReader();
  //        console.log(2)

  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext("2d");

  img = new Image();
  img.onload = function () {

    canvas.height = canvas.width * (img.height / img.width);

    /// step 1
    var oc = document.createElement('canvas'),
      octx = oc.getContext('2d');

    oc.width = 250;
    oc.height = 250;
    octx.drawImage(img, 0, 0, oc.width, oc.height);

    /// step 2
//    octx.drawImage(oc, 0, 0, oc.width, oc.height);

    ctx.drawImage(oc, 0, 0, oc.width, oc.height,
      0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL();
  }
   
  if (file) {
    reader.readAsDataURL(file); 
  }

   
  reader.addEventListener("load", function () {
            img.src = reader.result;

     }, false);

}

// IndexedDB

var db = new Dexie("database");

db.version(1).stores({
  indi_chat: 'nick, pic, distance, messages',
  group_chat: 'group_name, members, pic, messages, mem_info'
});

//db.indi_chat.put();