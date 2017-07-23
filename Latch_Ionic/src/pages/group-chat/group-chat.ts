import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { ImagePicker } from '@ionic-native/image-picker';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

// import { EmojiPanel } from 'emojipanel';
// import * as io from 'socket.io-client';
/**
 * Generated class for the GroupChat page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var io;
declare var EmojiPanel;

@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {

  messages = [];
  newMessage = {};
  newMessageText = '';
  user = {};
  data = {};
  group_name = '';
  socket: any;
  

  constructor(public navCtrl: NavController, private imagePicker:ImagePicker, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
	  this.group_name = this.navParams.get('group')['group_name'];
	  if(this.navParams.get('group')['uid']!=null)
	  	this.data['uid'] = this.navParams.get('group')['uid'];
	  this.storage.get('nick').then((nick)=>{
	  	this.user['nick'] = nick;
	  });
	  this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
		this.loadMessages();
	  });
	  this.socket = io.connect('172.16.1.139', {
		  port: 4000
		});
	  this.socket.on('send_message_group', (rawData)=>{
	  		console.log(1);
	  		let data = JSON.parse(rawData);
	  		// console.log(this.user['nick'] != data.nick
		    data.message = atob(data.message);
		    if (this.group_name == data.group_name && this.user['nick'] != data.nick) {
		      this.messages.push(data);
		      // chatScreen.scrollTop += $('.message-wrapper').outerHeight();
		    } else if (this.user['nick'] == data.nick) {
		    	console.log('yea');
		      for (let i = this.messages.length - 1; i >= 0; i--) {
		      	console.log(this.messages[i].msg_id ,data.msg_id);
		        if (this.messages[i].msg_id == data.msg_id) {
		          this.messages[i].sent = true;
		          console.log('wooa');
		        }
		      }
		        }
		        else if(Object.getOwnPropertyNames(data).length > 0)  {
		          // Materialize.toast('New Message in '+data.group_name,1000);
		          // notify
		        }
	          this.dispatchPush(data);

		  });




  }

  ionViewDidLoad() {
  	setTimeout(()=>{

  	let home = new EmojiPanel({
                container: '#emoji',
                // trigger: '#triggerEmoji',
                // editable: '#inputField'
    });
    console.log(home);
  },500)
    console.log('ionViewDidLoad GroupChat');
    var objDiv = document.getElementById("message-section-wrapper");
			objDiv.scrollTop = objDiv.scrollHeight;
  }

  loadMessages(){
  	 this.httpService.postData(this.globalVars.baseUrl+'/main/room/get/'+this.group_name+'/',this.data)
    .then(response=>{
    	for (var i = 0; i < response.messages.length; i++) {
	        response.messages[i].nick = response.messages[i].nick_name;
	        response.messages[i].sent = true;
	        response.messages[i].message  = atob(response.messages[i].message);
	     }
	     this.messages = response.messages;

	     // retreive from db
    });

  }

  sendNewMessage(){
  	 if(this.newMessageText == ''){
  	 	return;
  	 }
  	 let date = new Date();
     let dateString = new Date().toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      });

    let encodedMessage = btoa(this.newMessageText); 
  	this.newMessage = {
        message: encodedMessage,
        nick: this.user['nick'],
        group_name: this.group_name,
        time: dateString,
        sent: false,
        msg_id: UUID.UUID(),
        session_key: this.data['session_key'],
        is_image : false,
      }

    this.socket.emit('send_message_group', JSON.stringify(this.newMessage));
    this.newMessage['message'] = this.newMessageText;
    this.messages.push(this.newMessage);
    this.newMessageText = '';
  }

  dispatchPush(data){
  	data['session_key'] =  this.data['session_key'];
  	data['isUser'] = 'isUser';
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/group_notify/',data)
    .then((response)=>{
    	console.log('push');
    });
  }

  attachPic() {
    let options = {
      maximumImagesCount: 1,
    };
    let date = new Date();
    let dateString = new Date().toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      });

    this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.newMessage = {
              message: results[i],
              nick: this.user['nick'],
              group_name: this.group_name,
              time: dateString,
              sent: false,
              msg_id: UUID.UUID(),
              session_key: this.data['session_key'],
              is_image : true,
            };
            this.socket.emit('send_message_group', JSON.stringify(this.newMessage));
            this.messages.push(this.newMessage);
            this.newMessageText = '';

        }
      }, (err) => { });
  }

}
