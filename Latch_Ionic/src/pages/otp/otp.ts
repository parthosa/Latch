import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';

import { NickPage } from '../nick/nick';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';


import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
/**
 * Generated class for the Otp page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {

  otp = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,private push:Push,public alertCtrl: AlertController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Otp');
  }

  verifyOtp(){
  	let data = {};
  	this.storage.get('otp_id').then((otp_id) => {
  	data = {
  		otp : this.otp,
  		otp_id: otp_id
  	}

   	
   	this.storage.get('contact').then((contactVal) => {
   		data['contact'] = contactVal;
	   	this.storage.get('contact_number').then((contact_number) => {
	   		data['contact_number'] = Number.parseInt(contact_number);
   			this.storage.get('password').then((password) => {
		   		data['password'] = password;
			  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/verify/otp/',data)
			  	.then(response=>{
			  		if(response.status == 0){
				          this.alertCtrl.create({
				            title: 'Message',
				            subTitle: response.message,
				            buttons: ['OK']
				          }).present();
				          return;
				      }
			  		if(response.status == 1){
				        this.storage.set('session_key', response.session_key);
                this.globalVars.initPush();
			  			this.navCtrl.push(NickPage);
            }

			  	});
		  	});
	   	});
   	});

  	})
  	// signIn

  }

}
