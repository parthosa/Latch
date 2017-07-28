import { Component } from '@angular/core';
import { NavController, NavParams ,ViewController} from 'ionic-angular';

/**
 * Generated class for the Modal page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  reviews = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.reviews = this.navParams.get('reviews');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Modal');
  }

  dismiss() {
   
 }

}
