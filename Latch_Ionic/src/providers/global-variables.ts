import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


import {
  Push,
  PushToken
} from '@ionic/cloud-angular';



@Injectable()
export class GlobalVariables {

	  public baseUrl : String;

	  constructor(private httpService:HttpService, public geolocation: Geolocation, private storage:Storage,public push:Push,public alertCtrl: AlertController, public toastCtrl: ToastController){
	  	this.baseUrl = 'http://172.16.1.139:8001';
	  }

	  updateLocation(){
	  	this.geolocation.getCurrentPosition().then((position) => {

	      var pos = {
	            lat: position.coords.latitude,
	            lng: position.coords.longitude
	          };
	      })

	  	this.storage.get('session_key').then((session_key) => {
          var data = {
            lat: pos.lat,
            longitude: pos.lng,
            'session_key' : session_key,
          }
        })

       this.httpService.postData(this.globalVars.baseUrl+'/main/user/location/',this.data)
        .then(response=>{
           if (response.status != 1){
                this.toastCtrl.create({
                  message: 'Please enable location servies',
                  duration: 3000
                }).present();
              }
          });
	 
	  }


}