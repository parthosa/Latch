import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

import {
  Push,
  PushToken
} from '@ionic/cloud-angular';


/**
 * Generated class for the SignIn page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public push: Push,public alertCtrl: AlertController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.user['contact'] = 'test167@gmail.com';
  	this.user['password'] = 'techiegeek';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignIn');
  }

  signIn(){

  	this.httpService.postData(this.globalVars.baseUrl + '/main/accounts/login/',this.user)
  	.then(response=>{
  		console.log(response.status == 0);
  		if(response.status == 0){
  			console.log(1);
          let alert = this.alertCtrl.create({
            title: 'Message',
            subTitle: response.message,
            buttons: ['OK']
          });
          alert.present();
      } else{
  		this.storage.set('indi_chat',[]);
       this.storage.set('group_chat',[]);
       this.storage.set('chat_bot',[]);
       this.storage.set('loggedIn', true);
       this.storage.set('nick', response.nick);
       this.storage.set('pic', response.pic);
       this.storage.set('session_key', response.session_key);
       this.globalVars.updateLocation();
	  	this.globalVars.initPush();
	  	this.navCtrl.setRoot(HomePage);


  	}
  });
  	// signIn

  }

}
