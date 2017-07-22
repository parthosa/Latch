import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OtpPage } from '../otp/otp';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MobileNum page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-mobile-num',
  templateUrl: 'mobile-num.html',
})
export class MobileNumPage {

  mobNum = '9999461307';
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileNum');
  }

   submit(){
   	this.storage.get('contact').then((contactVal) => {
   	console.log(contactVal);
   	this.storage.set('contact_number',this.mobNum);
  	let data = {
  		'contact_number':Number.parseInt(this.mobNum),
  		'contact':contactVal
  	}
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/get/contact/',data)
  	.then(response=>{
  		if(response.status == 1){
  			this.storage.set('otp_id', response.otp_id);
  			this.navCtrl.push(OtpPage);
  		}
  	});
  	});
  	// signIn
	// this.navCtrl.setRoot(HomePage);

  }

}
