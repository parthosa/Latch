import { Component } from '@angular/core';
import { GroupChatPage } from '../../pages/group-chat/group-chat';
import { NavController, NavParams } from 'ionic-angular';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'groups',
  templateUrl: 'groups.html'
})
export class Groups {

  text: string;
  groups = [];
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private globalVars: GlobalVariables,private storage:Storage) {
    this.initGroups();
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	    this.getGroups();
	  });
  }

  initGroups(){
  	this.storage.get('group_chat').then((group_chat)=>{
      		console.log(group_chat);
      		this.groups = group_chat;
      	});
  }


  getGroups(){
  	 this.httpService.postData(this.globalVars.baseUrl+'/main/user/get_groups/',this.data)
    .then(response=>{
    
      	this.storage.set('group_chat',response.groups);
      	this.groups = response.groups;
      	console.log(this.groups);
    });
  }

  openChat(group){
  	this.navCtrl.push(GroupChatPage,{
  		group:group
  	});
  }

  format(group_name){
  	return group_name.substr(group_name.indexOf('_')+1);
  }

}
