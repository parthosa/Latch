import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Geolocation } from '@ionic-native/geolocation';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

import { Platform } from 'ionic-angular';
import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

import { ModalPage } from '../modal/modal';
import { ModalController } from 'ionic-angular';
declare var google;
declare var pos;

/**
 * Generated class for the BotMap page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-bot-map',
  templateUrl: 'bot-map.html',
})
export class BotMapPage {
@ViewChild('map') mapElement: ElementRef;
 	map: GoogleMap;
  marker:any;
  latLng : LatLng;
  reviews = [];
  constructor(public modalCtrl: ModalController,public navCtrl:NavController,public navParams:NavParams, public platform: Platform, public geolocation: Geolocation,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BotMap');
     this.platform.ready().then(() => {
    	this.loadMap();
    });
  }


  loadMap(){

      var pos = {
            lat: this.navParams.get('lat'),
            lng: this.navParams.get('long')
          };
       var $this = this;

      console.log(pos);

       if(pos.lat != 0 && pos.lng !=0 ){
 		
       this.latLng = new google.maps.LatLng(this.navParams.get('lat'),this.navParams.get('long'));
 		console.log(this.latLng);
       let mapOptions = {
         center: this.latLng,
         zoom: 13,
         tilt: 0,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         streetViewControl: false,
         fullscreenControl: false,
       }
 
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

       let marker = new google.maps.Marker({
            position: this.latLng,
            map:this.map,
            label:this.navParams.get('title')
          });
       this.map.setCenter(this.latLng);
       // marker.setMap(this.map);
        this.map.setZoom(13);

        console.log(marker);
         marker.addListener('click', function (event) {
         	$this.httpService.postData($this.globalVars.baseUrl+"/main/user/restaraunt/reviews/",{id:$this.navParams.get('restId') })
	        .then(response=>{
	        	$this.reviews = response.reviews;
	        	let modal = $this.modalCtrl.create(ModalPage, { reviews: $this.reviews });
				   modal.present();
         });
	    });
        }
        else{
        	console.log('else');
        }
       // this.map.setMyLocationEnabled(true);
                
       // this.storage.get('session_key').then((session_key) => {
       //    this.data = {
       //      lat: pos.lat,
       //      longitude: pos.lng,
       //      'session_key' : session_key,
       //    }
	      //  this.httpService.postData(this.globalVars.baseUrl+'/main/user/location/',this.data)
	      //   .then(response=>{
	      //      if (response.status != 1){
	      //           this.toastCtrl.create({
	      //             message: 'Please enable location servies',
	      //             duration: 3000
	      //           }).present();
	      //         }
	      //     });

	      //   this.getNearby();
       //  })


 
   }
}
