import { Component } from '@angular/core';
import { IndiChatPage } from '../../pages/indi-chat/indi-chat';
import { ChatBotPage } from '../../pages/chat-bot/chat-bot';
import { NavController, NavParams } from 'ionic-angular';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Groups component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chats',
  templateUrl: 'chats.html'
})
export class Chats {

  text: string;
  chats: any[];
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private globalVars: GlobalVariables,private storage:Storage) {
    this.initChats();
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	    this.getChats();
	  });
  }

  initChats(){
      	this.storage.get('indi_chat').then((indi_chat)=>{
      		console.log(indi_chat);
      		this.chats = indi_chat;
      	});

  }

  getChats(){
  	 this.httpService.postData(this.globalVars.baseUrl+'/main/user/get_chat_list/',this.data)
    .then(response=>{
    	response.peers.map(function (e, i) {
        if (e.messages == undefined)
          e.messages = [];
      	});
      	this.storage.set('indi_chat',response.peers);
      	this.chats = response.peers;
    });
  }

  openChatBot(){
  	this.navCtrl.push(ChatBotPage);
  }

  openChat(){
  	this.navCtrl.push(IndiChatPage);
  }

}
