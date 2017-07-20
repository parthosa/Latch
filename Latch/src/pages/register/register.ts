import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UploadPicPage } from '../upload-pic/upload-pic';
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.user['name'] = '';
  	this.user['email'] = '';
  	this.user['password'] = '';
  	this.user['confirm_password'] = '';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register');
  }

  signUp(){
  	console.log(this.user);
  	this.navCtrl.push(UploadPicPage);
  }

}
