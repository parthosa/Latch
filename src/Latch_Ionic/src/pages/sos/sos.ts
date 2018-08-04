import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Sos page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-sos',
  templateUrl: 'sos.html',
})
export class SosPage {

  members = [];	
  data = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.members = [];
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Sos');
  }

  submit(){
  	this.data['members'] = this.members.join(',');
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/add/sos/',this.data)
    .then(response=>{
    		if(response.status == 0)
    			console.log('Error');
    		this.navCtrl.pop();
	    });
  }


  

}
