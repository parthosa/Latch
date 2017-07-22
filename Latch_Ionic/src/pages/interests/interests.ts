import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the Interests page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-interests',
  templateUrl: 'interests.html',
})
export class InterestsPage {

  interest = '';
  food: boolean;
  accomodation: boolean;
  travel: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Interests');
  }

  submitInterests(){
  	if(this.food)
  		this.interest +='Food,';
  	if(this.accomodation)
  		this.interest +='Accomodation,';
  	if(this.travel)
  		this.interest +='Travel,';

  	console.log(this.interest);

  	this.navCtrl.setRoot(HomePage);
  }
}
