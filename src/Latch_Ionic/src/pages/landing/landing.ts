import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SignInPage } from '../sign-in/sign-in';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Landing');
  }

  goToRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

  goToSignInPage(){
    this.navCtrl.push(SignInPage);
  }
}
