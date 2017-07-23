import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';


// import * as EmojiPanel from 'emojipanel/emojipanel.js';
// declare var EmojiPanel;
/**
 * Generated class for the SignIn page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.user['contact'] = 'test167@gmail.com';
  	this.user['password'] = 'techiegeek';
  }

  ionViewDidLoad() {
  	 // let home = new EmojiPanel({
    //             container: '#sign-in',
    //             trigger: '#sign-2',
    //             editable: '#sign-3'

    // });
    // console.log(home);
  }

  signIn(){

  	this.httpService.postData(this.globalVars.baseUrl + '/main/accounts/login/',this.user)
  	.then(response=>{
  		console.log(response.status == 0);
  		if(response.status == 0){
  			console.log(1);
          let alert = this.alertCtrl.create({
            title: 'Message',
            subTitle: response.message,
            buttons: ['OK']
          });
          alert.present();
      } else{
  		this.storage.set('indi_chat',[]);
       this.storage.set('group_chat',[]);
       this.storage.set('chat_bot',[]);
       this.storage.set('loggedIn', true);
       this.storage.set('nick', response.nick);
       this.storage.set('pic', response.pic);
       this.storage.set('session_key', response.session_key);
       this.globalVars.updateLocation();
    //     this.push.register().then((t: PushToken) => {
    //     return this.push.saveToken(t);
    //   }).then((t: PushToken) => {
    //   	this.httpService.postData(this.globalVars.baseUrl+'/main/user/get_device/',{'session_key':response.session_key,'device_id':t.token})
    //     .then(response=>{
    //     console.log('Token saved:', t.token);
        	


	  	// });
       	  	this.navCtrl.setRoot(HomePage);
  }
  	// signIn

  });


};
}

