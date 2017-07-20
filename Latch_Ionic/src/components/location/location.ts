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


/**
 * Generated class for the Location component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
 @Component({
 	selector: 'location',
 	templateUrl: 'location.html'
 })
 export class Location {

 	map: GoogleMap;

 	// @ViewChild('map') mapElement: ElementRef;
	 // map: any;
 
    constructor(public geolocation: Geolocation) {

    }
 
    ngAfterViewInit() {
    console.log('ionViewDidLoad Location');

    	this.loadMapNative();
    }

//     loadMap(){
//     	this.geolocation.getCurrentPosition().then((position) => {
 
//       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
//       let mapOptions = {
//         center: latLng,
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       }
 
//       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
//     }, (err) => {
//       console.log(err);
//     });
 
//   }

//   addMarker(){
 
//   let marker = new google.maps.Marker({
//     map: this.map,
//     animation: google.maps.Animation.DROP,
//     position: this.map.getCenter()
//   });
 
//   let content = "<h4>Information!</h4>";          
 
//   this.addInfoWindow(marker, content);
 
// }

// addInfoWindow(marker, content){
 
//   let infoWindow = new google.maps.InfoWindow({
//     content: content
//   });
 
//   google.maps.event.addListener(marker, 'click', () => {
//     infoWindow.open(this.map, marker);
//   });
 
// }

	loadMapNative(){
		let location = new LatLng(-34.9290,138.6010);
 
        this.map = new GoogleMap('map', {
          'backgroundColor': 'white',
          'controls': {
            'compass': true,
            'myLocationButton': true,
            'indoorPicker': true,
            'zoom': true
          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            'latLng': location,
            'tilt': 30,
            'zoom': 15,
            'bearing': 50
          }
        });
 
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
        });
 
    }

}
