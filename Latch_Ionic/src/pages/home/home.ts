import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';

import { Chats } from '../../components/chats/chats';
import { Groups } from '../../components/groups/groups';
import { Location } from '../../components/location/location';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  screens = '';
  data = {};
  constructor(public navCtrl: NavController,public geolocation: Geolocation,public toastCtrl:ToastController,public menuCtrl: MenuController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.menuCtrl.enable(true);
  	this.screens = 'Chats';

  }

  initSOS(){
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
	       this.httpService.postData(this.globalVars.baseUrl+'/main/user/send/sos/',data)
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
