import { Component } from '@angular/core';
import { IndiChatPage } from '../../pages/indi-chat/indi-chat';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private globalVars: GlobalVariables,private storage:Storage) {
    console.log('Hello Groups Component');
    this.text = 'Hello World';
  	// this.httpService.postData(this.globalVars.baseUrl+'/main/user/interests/',this.data)
    
    this.chats = [{
    	'nick':"Partho",
    	'distance':'1km',
    	'pic':'assets/images/batman.png'
    }];
  }

  openChatBot(){
  	// do something
  }

  openChat(){
  	this.navCtrl.push(IndiChatPage);
  }

}
