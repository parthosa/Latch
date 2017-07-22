import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../providers/http-service';


import { HomePage } from '../home/home';


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

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService : HttpService) {
  	this.user['email'] = '';
  	this.user['password'] = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignIn');
  }

  signIn(){
  	console.log(this.user);
  	this.httpService.postData('/api/sign-in',this.user)
  	.then(response=>{
  		console.log(response);
  	});
  	// signIn
	this.navCtrl.setRoot(HomePage);

  }

}
