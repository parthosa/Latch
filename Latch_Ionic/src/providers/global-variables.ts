import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Storage } from '@ionic/storage';

import { AlertController } from 'ionic-angular';


import {
  Push,
  PushToken
} from '@ionic/cloud-angular';


@Injectable()
export class GlobalVariables {

	  public baseUrl : String;

	  constructor(private httpService:HttpService,private storage:Storage,public push:Push,public alertCtrl: AlertController){
	  	this.baseUrl = 'http://172.16.1.139:8001';
	  }

	  updateLocation(){
	  	  let locationData = {};
	  	  this.storage.get('session_key').then((session_key) => {
	          locationData = {
	            lat: 41.403,
	            longitude: 2.17,
	            'session_key' : session_key,
	          }
		       this.httpService.postData(this.baseUrl+'/main/user/location/',locationData)
		        .then(response=>{
		           if (response.status != 1){
		                this.alertCtrl.create({
		                  message: 'Please enable location servies',
		                }).present();
		              }
		          });
	        });

	 
	  }


	  initPush(){
	  	 this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      });
 
      this.push.rx.notification()
      .subscribe((msg) => {
        console.log('I received awesome push: ' + msg);
      });
	  }
}