import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InterestsPage } from '../interests/interests';
import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpService) {
  	this.user['name'] = '';
  	this.user['contact'] = '';
  	this.user['password'] = '';
  	this.user['confirm_password'] = '';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register');
  }

  signUp(){
    this.httpService.postData(GlobalVariables.baseUrl+'/main/accounts/register/')
  	console.log(this.user);
  	this.navCtrl.push(InterestsPage);
  }

}
