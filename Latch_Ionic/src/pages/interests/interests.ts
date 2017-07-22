import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the Interests page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-interests',
  templateUrl: 'interests.html',
})
export class InterestsPage {

  interests = '';
  food: boolean;
  accomodation: boolean;
  travel: boolean;
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Interests');
  }

  submitInterests(){
  	if(this.food)
  		this.interests +='Food,';
  	if(this.accomodation)
  		this.interests +='Accomodation,';
  	if(this.travel)
  		this.interests +='Travel,';
  	this.data['interests'] = this.interests;
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/interests/',this.data)
    .then(response=>{
	  	console.log(this.interests);
	  	if(response.status == 1)
	  		this.addToChatRoom(); 
	  });

  }

  addToChatRoom(){
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/add_chatroom/',this.data)
    .then(response=>{
	  	if(response.status == 1)
		  	this.navCtrl.setRoot(HomePage);
	  });
  }
}
