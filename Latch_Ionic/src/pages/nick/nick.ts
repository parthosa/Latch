import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';

import { UploadPicPage } from '../upload-pic/upload-pic'

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Nick page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-nick',
  templateUrl: 'nick.html',
})
export class NickPage {

  nick = '';
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.storage.get('session_key').then((session_key) => {
	  	this.data = {
	  		'session_key' : session_key,
	  	}
	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Nick');
  }

  submit(){
  	this.data['nick'] = this.nick;
  	this.httpService.postData(this.globalVars.baseUrl+'/main/user/nick/',this.data)
    .then(response=>{

    		this.navCtrl.push(UploadPicPage);
	    });

  }

}
