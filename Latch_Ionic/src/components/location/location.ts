import { Component,ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController } from 'ionic-angular';
import { IndiChatPage } from '../../pages/indi-chat/indi-chat';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

import * as MarkerClusterer from 'node-js-marker-clusterer';

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
  nick = '';
  session_key = '';
   // map: any;
 
    constructor(public navCtrl: NavController, public platform: Platform, public geolocation: Geolocation,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables, public toastCtrl: ToastController) {

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
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         streetViewControl: false,
         fullscreenControl: false,
       }
 
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

       var marker = new google.maps.Marker({
            position: pos
          });
       this.map.setCenter(latLng);
       marker.setMap(this.map);
        this.map.setZoom(13);

       // this.map.setMyLocationEnabled(true);
                
       this.storage.get('session_key').then((session_key) => {
          this.data = {
            lat: pos.lat,
            longitude: pos.lng,
            'session_key' : session_key,
          }
         this.httpService.postData(this.globalVars.baseUrl+'/main/user/location/',this.data)
          .then(response=>{
             if (response.status != 1){
                  this.toastCtrl.create({
                    message: 'Please enable location servies',
                    duration: 3000
                  }).present();
                }
            });

          this.getNearby();
        })



 
     }, (err) => {
       console.log(err);
     });
 
   }

   getNearby() {

   var markers = [];

   var markerCluster = new MarkerClusterer(this.map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

   var CustomMarker = function (latlng, map, imageSrc, nick, distance) {
      this.nick = nick;
      this.distance = distance;
      this.latlng_ = latlng;
      this.imageSrc = imageSrc;
      this.setMap(this.map);
      markers.push(this);
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function () {
      // Check if the div has been created.
      var div = this.div_;
      if (!div) {
        // Create a overlay text DIV
        div = this.div_ = document.createElement('div');
        // Create the DIV representing our CustomMarker
        div.className = "customMarker"

        var me = this;
        var img = document.createElement("img");
        img.src = this.imageSrc;
        div.appendChild(img);
        google.maps.event.addDomListener(div, "click", function (event) {
          google.maps.event.trigger(me, "click");
          // $('.modal').modal();
          // $scope.locModal = {
          //   lat: me.latlng_.lat(),
          //   lng: me.latlng_.lng(),
          //   nick: me.nick,
          //   pic: me.imageSrc,
          //   distance: me.distance
          // }
          // $scope.$apply();
          // $('.modal').modal('open');
        });

        // Then add the overlay to the DOM
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
      }

      // Position the overlay 
      var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
      }
    };

    CustomMarker.prototype.remove = function () {
      // Check if the overlay was on the map and needs to be removed.
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    CustomMarker.prototype.getPosition = function () {
      return this.latlng_;
    };

    // var data = [{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.365, 75.57],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.37, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.36, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // },{
    //   profileImage: 'https://avatars3.githubusercontent.com/u/10223953',
    //   pos: [28.39, 75.58],
    //   distance: 5,
    //   nick: 'bug'
    // }]

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.storage.get('nick').then(result=>{
      this.nick = result;
    })

    this.storage.get('session_key').then(result=>{
      this.session_key = result;
      this.httpService.postData(this.globalVars.baseUrl+'/main/user/get_nearby/', { session_key: result}).then(response=>{
        if (response.status == 1) {
        var data = response.nearby_users;
        for (var i = 0; i < data.length; i++) {
          if (data[i].nick != this.nick)
            this.addMarker(new google.maps.LatLng(data[i].lat, data[i].longitude), this.map, data[i].nick);
            // new CustomMarker(new google.maps.LatLng(data[i].lat, data[i].longitude), this.map, this.globalVars.baseUrl + data[i].pic, data[i].nick, data[i].distance)
        }
        console.log(markers);

      } else{
        this.toastCtrl.create({
                  message: 'Cannot Fetch Nearby Users',
                  duration: 2000
                }).present();
      }
    
      })
      
    })


    }

addMarker(location, map, label) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
            var marker = new google.maps.Marker({
              position: location,
              label: label,
              map: map
            });
            var $this = this;
            marker.addListener('click', param=>{
              this.navCtrl.push(IndiChatPage,{
                nick_name: label,
                session_key: $this.session_key
              });
            })
          }





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
 



