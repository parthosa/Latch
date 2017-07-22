import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';

import { Chats } from '../../components/chats/chats';
import { Groups } from '../../components/groups/groups';
import { Location } from '../../components/location/location';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  screens = '';
  constructor(public navCtrl: NavController,public menuCtrl: MenuController) {
  	this.menuCtrl.enable(true);
  	this.screens = 'Chats';
  }

}
