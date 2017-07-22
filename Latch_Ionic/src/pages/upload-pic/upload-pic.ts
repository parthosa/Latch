import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';

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
	constructor(public navCtrl: NavController, public navParams: NavParams,private transfer: FileTransfer, private file: File, private imagePicker: ImagePicker) {
		this.user['profile_pic'] = '';
	}

 		
 	fileTransfer: FileTransferObject = this.transfer.create();	

	ionViewDidLoad() {
	console.log('ionViewDidLoad UploadPic');
	}

	uploadProfilePic(){
		console.log(this.user);
	}

}
