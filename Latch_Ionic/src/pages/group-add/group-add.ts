import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the GroupAdd page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-group-add',
  templateUrl: 'group-add.html',
})
export class GroupAddPage {

  members = [{'name':''}];
  group_name = '';
  data = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	  });
    	for(let i=0;i<4;i++){
    		this.members.push({
    			'name':''
    		});
    	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupAdd');
  }

  addMember(){
  	this.members.push({'name':''});
  }

  removeMember(i){
  	this.members.splice(i,1);
  }

  submit(){
  	this.data['members'] = [];
  	this.members.map((ele,i)=>{
  		if(ele.name!='')
	  		this.data['members'].push(Number.parseInt(ele.name));
  	});
  	this.data['group_name'] = this.group_name;
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/create/room/',this.data)
    .then(response=>{
    	if(response.status ==  1)
    		this.navCtrl.pop();
	  });
}
}
