import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MobileNumPage } from '../mobile-num/mobile-num';
import { OtpPage } from '../otp/otp';

import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the Register page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.user['name'] = 'Partho Sarthi';
  	this.user['contact'] = 'test167@gmail.com';
  	this.user['password'] = 'techiegeek';
  	this.user['confirm_password'] = 'techiegeek';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register');
  }

  signUp(){
    console.log(this.globalVars.baseUrl+'/main/accounts/register/');
    this.httpService.postData(this.globalVars.baseUrl+'/main/accounts/register/',this.user)
    .then(response=>{
       this.storage.set('indi_chat',{});
       this.storage.set('group_chat',{});
       this.storage.set('chat_bot',{});
       this.storage.set('loggedIn', true);
       this.storage.set('name', this.user['name']);
       this.storage.set('contact', this.user['contact']);
       this.storage.set('password', this.user['password']);
       if(response.get_contact_num)
        this.navCtrl.push(MobileNumPage);
       else{
        this.storage.set('otp_id', response.otp_id);
      	this.navCtrl.push(OtpPage);
       }
    });
    console.log(this.user);
  }

}
