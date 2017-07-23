import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Storage } from '@ionic/storage';

import { ToastController } from 'ionic-angular';


import {
  Push,
  PushToken
} from '@ionic/cloud-angular';



@Injectable()
export class GlobalVariables {

	  public baseUrl : String;

	  constructor(private httpService:HttpService,private storage:Storage,public push:Push,public toastCtrl: ToastController){
	  	this.baseUrl = 'http://172.16.1.139:8001';
	  }

	  updateLocation(url = '/main/user/location/'){
	  	  let locationData = {};
	  	  this.storage.get('session_key').then((session_key) => {
	          locationData = {
	            lat: 41.403,
	            longitude: 2.17,
	            'session_key' : session_key,
	          }
		       this.httpService.postData(this.baseUrl+url,locationData)
		        .then(response=>{
		           if(url !=''){
		           	this.toastCtrl.create({
		                  message: response.message,
		                  duration: 3000
		                }).present();
		           }
		           if (response.status != 1){
		                this.toastCtrl.create({
		                  message: 'Please enable location servies',
		                  duration: 3000
		                }).present();
		              }
		          });
	        });

	 
	  }


}