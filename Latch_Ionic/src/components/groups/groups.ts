import { Component } from '@angular/core';
import { GroupChatPage } from '../../pages/group-chat/group-chat';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Groups component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'groups',
  templateUrl: 'groups.html'
})
export class Groups {

  text: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('Hello Groups Component');
    this.text = 'Hello World';
  }

  openChat(){
  	this.navCtrl.push(GroupChatPage);
  }

}
