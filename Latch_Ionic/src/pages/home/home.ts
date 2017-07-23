import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';

import { Chats } from '../../components/chats/chats';
import { Groups } from '../../components/groups/groups';
import { Location } from '../../components/location/location';


import { GlobalVariables } from '../../providers/global-variables';
import { HttpService } from '../../providers/http-service';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  screens = '';
  data = {};
  constructor(public navCtrl: NavController,public menuCtrl: MenuController,private httpService: HttpService,private storage:Storage,private globalVars: GlobalVariables) {
  	this.menuCtrl.enable(true);
  	this.screens = 'Chats';

  }

  initSOS(){
  	this.globalVars.updateLocation('/main/user/send/sos/');
  }
 

}
