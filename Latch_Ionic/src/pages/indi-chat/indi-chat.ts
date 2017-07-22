import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';
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
  user = {
  	'nick' : 'parthosa'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.loadMessages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndiChat');
  }

  loadMessages(){
  	this.messages = [{
  		message: 'hello world',
        nick: 'partho',
        nick_name: 'itech',
        time: '3:30pm',
        sent: false,
        msg_id: UUID.UUID(),
        session_key: 'asaaa'
  	},{
  		message: 'yahoo',
        nick: 'partho',
        nick_name: 'itech',
        time: '5:01am',
        sent: false,
        msg_id: UUID.UUID(),
        session_key: 'asaaa'
  	}]

  }

  sendNewMessage(){
  	 let date = new Date();
     let dateString = new Date().toLocaleDateString() + ',' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      });

  	this.newMessage = {
        message: this.newMessageText,
        nick: 'partho',
        nick_name: 'itech',
        time: dateString,
        sent: false,
        msg_id: UUID.UUID(),
        session_key: 'asaaa'
      }

    this.messages.push(this.newMessage);
    this.newMessageText = '';
  }

}
