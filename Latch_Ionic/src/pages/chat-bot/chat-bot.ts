import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

import { BotMapPage } from '../bot-map/bot-map';

// import * as io from 'socket.io-client';
/**
 * Generated class for the GroupChat page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var io;

@Component({
  selector: 'page-chat-bot',
  templateUrl: 'chat-bot.html',
})
export class ChatBotPage {

  messages = [];
  newMessage = {};
  newMessageText = '';
  user = {};
  data = {};
  chat_bot_name = '';
  socket: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
	  this.chat_bot_name = 'Harley';
	  this.storage.get('nick').then((nick)=>{
	  	this.user['nick'] = nick;
	  });
	  this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	  });
	 //  this.socket = io.connect('172.16.1.139', {
		//   port: 4000
		// });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChat');
  }

  // loadMessages(){
  // 	 this.httpService.postData(this.globalVars.baseUrl+'/main/room/get/'+this.group_name+'/',this.data)
  //   .then(response=>{
  //   	for (var i = 0; i < response.messages.length; i++) {
	 //        response.messages[i].nick = response.messages[i].nick_name;
	 //     }
	 //     // retreive from db
  //   });

  // }

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

  	this.newMessage = {
        message: this.newMessageText,
        nick: this.user['nick'],
        nick_name: this.chat_bot_name,
        time: dateString,
        sent: true,
        msg_id: UUID.UUID(),
        session_key: this.data['session_key']
      };

    this.messages.push(this.newMessage);
    this.httpService.postData(this.globalVars.baseUrl+'/main/user/chat/bot/',this.newMessage)
    .then((response)=>{  
    	if(this.chat_bot_name == response.nick){
    		 if(response['restaurants']){
			    this.messages.push({
                  message: response.message,
                  nick:response.nick,
                  time: response.time
               });

              response['restaurants'].map((ele,i)=> {
              	console.log(i,ele);
              var indi_rest_msg = ele.name + ' \n ' + ele.restaurants.locality + ' \n ' + ele.restaurants.city ;
              this.messages.push({
                       message: indi_rest_msg,
                       nick:response.nick,
                       time:response.time,
                       lat:ele.lat,
                       long:ele.long,
                       address:ele.restaurants.address,
                       locality:ele.restaurants.locality,
                       city:ele.restaurants.city,
                       id:ele.id,
                       type:'restaurants'
                  });
              });

             
               // db.chat_bot.put({
               //    nick:'Harlie',
               //    message:$scope.messages
               //  })		
    		}else if(response['hotels']){
              
               this.messages.push({
                 message: response.message,
                  nick:response.nick,
                  time: response.time
               })
              response['hotels'].map((ele,i)=> {
                  var indi_rest_msg = ele.name + ' \n ' + ele.address;
                  this.messages.push({
                       message: indi_rest_msg,
                       nick:response.nick,
                       time:response.time,
                       lat:ele.lat,
                       long:ele.lng,
                       type:'hotels',
                       address:ele.address
                  });
              }) 

               // db.chat_bot.put({
               //    nick:'Harlie',
               //    message:$scope.messages
               //  })

            }
    		else {
    			this.messages.push(response);
    		}
    	}
    });
    this.newMessageText = '';
  }


  openMap (message) {
  	var data = {};
  if(message.type == "restaurants"){
    data['lat'] = message.lat;
    data['long'] = message.long;
    var sep = message.message.indexOf('\n');
    data['address'] = message.address;
    data['locality'] = message.locality;
    data['restId'] = message.id;
    data['city'] = message.city;
    
  }
  if(message.type == "hot"){
    data['lat'] = message.lat;
    data['long'] = message.long;
    data['address'] = message.address;
        var sep = message.message.indexOf('\n');
  }
   data['title'] = message.message.substr(0,sep);
   this.navCtrl.push(BotMapPage,data);
}
}

