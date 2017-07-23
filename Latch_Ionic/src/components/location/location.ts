import { Component,ViewChild, ElementRef } from '@angular/core';
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



/**
 * Generated class for the Location component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

declare var google;
declare var pos;

 @Component({
 	selector: 'location',
 	templateUrl: 'location.html'
 })
 export class Location {

 	@ViewChild('map') mapElement: ElementRef;
 	map: GoogleMap;
  data = {};

	 // map: any;
 
    constructor(public platform: Platform, public geolocation: Geolocation,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables, public toastCtrl: ToastController) {

    }
 
    ngAfterViewInit() {
        console.log('ionViewDidLoad Location');
        this.platform.ready().then(() => {
    	this.loadMap();
    })
    }

     loadMap(){
     	this.geolocation.getCurrentPosition().then((position) => {

      var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

      console.log(pos);
 
       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
       let mapOptions = {
         center: latLng,
         zoom: 13,
         tilt: 0,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       }
 
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

                
       this.storage.get('session_key').then((session_key) => {
          this.data = {
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
 
     }, (err) => {
       console.log(err);
     });
 
   }


//   addMarker(){
// 
//   let marker = new google.maps.Marker({
//     map: this.map,
//     animation: google.maps.Animation.DROP,
//     position: this.map.getCenter()
//   });
// 
//   let content = "<h4>Information!</h4>";          
// 
//   this.addInfoWindow(marker, content);
// 
// }

 // addInfoWindow(marker, content){
 
 //   let infoWindow = new google.maps.InfoWindow({
 //     content: content
 //   });
 
 //   google.maps.event.addListener(marker, 'click', () => {
 //     infoWindow.open(this.map, marker);
 //   });
 
 // }

//	loadMapNative(){
//		let location = new LatLng(20.8912676,73.7361989);
// 
//        this.map = new GoogleMap('map', {
//          'backgroundColor': 'white',
//          'controls': {
//            'compass': true,
//            'myLocationButton': true,
//            'indoorPicker': true,
//            'zoom': true
//          },
//          'gestures': {
//            'scroll': true,
//            'tilt': true,
//            'rotate': true,
//            'zoom': true
//          },
//          'camera': {
//            'latLng': location,
//            'tilt': 0,
//            'zoom': 15,
//            'bearing': 50
//          }
//        });
// 
//        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
//            console.log('Map is ready!');
//        });
 
    }


