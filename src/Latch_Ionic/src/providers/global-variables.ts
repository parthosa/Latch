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
	  public url: String;

	  constructor(private httpService:HttpService, public geolocation: Geolocation, private storage:Storage,public push:Push,public alertCtrl: AlertController, public toastCtrl: ToastController){
	  	this.url = '192.168.43.56';
	  	this.baseUrl = 'http://'+this.url+':8001';
	  }

	  updateLocation(){
	  	this.geolocation.getCurrentPosition().then((position) => {

	      var pos = {
	            lat: position.coords.latitude,
	            lng: position.coords.longitude
	          };
	  	this.storage.get('session_key').then((session_key) => {
          var data = {
            lat: pos.lat,
            longitude: pos.lng,
            'session_key' : session_key,
          }
	       this.httpService.postData(this.baseUrl+'/main/user/location/',data)
	        .then(response=>{
	           if (response.status != 1){
	                this.toastCtrl.create({
	                  message: 'Please enable location servies',
	                  duration: 3000
	                }).present();
	              }
	          });
	      })

        })

	 
	  }


}