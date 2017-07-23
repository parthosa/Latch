import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
// import { Crop } from '@ionic-native/crop';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';
import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';

import { InterestsPage } from '../interests/interests';

/**
 * Generated class for the UploadPic page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-upload-pic',
  templateUrl: 'upload-pic.html',
})
export class UploadPicPage {


 	user = {};
 	dataURL : any;

	constructor(public navCtrl: NavController, public navParams: NavParams,private transfer: FileTransfer,private imagePicker:ImagePicker, private file: File,  private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
		this.dataURL;
	}

 		
 	fileTransfer: FileTransferObject = this.transfer.create();	

	ionViewDidLoad() {
	console.log('ionViewDidLoad UploadPic');
	}

	submitPic() {
    var formData = new FormData();
    this.storage.get('session_key').then((param)=>{
    	formData.append('session_key', param);
    });
    formData.append('dpic', this.dataURItoBlob(this.dataURL), UUID.UUID()+".png");
    this.httpService.postData(this.globalVars.baseUrl+'/main/user/profile_pic/',formData)
    .then(response=>{
    	this.navCtrl.push(InterestsPage);
    });

	}

	pickImage() {

 		  var submit_button = document.getElementById("submit") as HTMLButtonElement;
		  var canvas = document.getElementById("uploaded-image") as HTMLCanvasElement;
		  var ctx = canvas.getContext("2d");
		  var uploadClass = this;
		  let img = new Image();
		  img.onload = function () {

		    canvas.height = canvas.width * (img.height / img.width);

		    /// step 1
		    var oc = document.createElement('canvas'),
		      octx = oc.getContext('2d');

		    oc.width = 250;
		    oc.height = 250;
		    octx.drawImage(img, 0, 0, oc.width, oc.height);

		    /// step 2
		//    octx.drawImage(oc, 0, 0, oc.width, oc.height);

		    ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.height);
		    uploadClass.dataURL = canvas.toDataURL();

		    submit_button.removeAttribute('disabled');

		}
	
		// let uploadedPic = document.getElementById("uploadedPic") as HTMLImageElement;
	
		let options = {
			maximumImagesCount: 1,

		};




		// this.imagePicker.requestReadPermission().then(()=>{
			this.imagePicker.getPictures(options).then((results) => {
			  for (var i = 0; i < results.length; i++) {
			      console.log('Image URI: ' + results[i]);
			      img.src = results[i];
			  }
			}, (err) => { });
		// })
	}

	dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
      });
    }


}
