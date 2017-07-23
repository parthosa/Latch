import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { ImagePicker } from '@ionic-native/image-picker';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

declare var io;


/**
 * Generated class for the IndiChat page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-indi-chat',
  templateUrl: 'indi-chat.html',
})
export class IndiChatPage {

  messages = [];
  newMessage = {};
  newMessageText = '';
  user = {};
  data = {};
  nick_name = '';
  socket: any;

  constructor(public navCtrl: NavController, private imagePicker:ImagePicker, public navParams: NavParams, private httpService: HttpService, private storage:Storage,private globalVars: GlobalVariables) {
  	this.nick_name = this.navParams.get('chat')['nick_name'];
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
	  this.socket.on('send_message_indi', (rawData)=>{
	  		let data = JSON.parse(rawData);
	  		// console.log(this.user['nick'] != data.nick
		    data.message = atob(data.message);
		    if (this.nick_name == data.nick_name && this.user['nick'] != data.nick) {
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
		          // Materialize.toast('New Message in '+data.nick_name,1000);
		          // notify
		        }
		          this.dispatchPush(data);

		  });




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChat');
  }

  loadMessages(){
  	this.data['nick'] = this.user['nick'];
  	 this.httpService.postData(this.globalVars.baseUrl+'/main/user/get/indi_chat/',this.data)
    .then(response=>{
    	for (var i = 0; i < response.messages.length; i++) {
	        response.messages[i].nick = response.messages[i].nick_name;
	     }
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
        nick_name: this.nick_name,
        time: dateString,
        sent: false,
        msg_id: UUID.UUID(),
        session_key: this.data['session_key'],
        is_image: false
      }

    this.socket.emit('send_message_indi', JSON.stringify(this.newMessage));
    this.newMessage['message'] = this.newMessageText;
    this.messages.push(this.newMessage);
    this.newMessageText = '';
  }


  dispatchPush(data){
  	data['session_key'] =  this.data['session_key'];
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/indi_notify/',data)
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
              nick_name: this.nick_name,
              time: dateString,
              sent: false,
              msg_id: UUID.UUID(),
              session_key: this.data['session_key'],
              is_image : true,
            };
            this.socket.emit('send_message_indi', JSON.stringify(this.newMessage));
            this.messages.push(this.newMessage);
            this.newMessageText = '';

        }
      }, (err) => { });
  }

}
