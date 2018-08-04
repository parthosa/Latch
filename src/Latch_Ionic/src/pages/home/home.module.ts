import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { Chats } from '../../components/chats/chats';
import { Groups } from '../../components/groups/groups';
import { Location } from '../../components/location/location';

@NgModule({
  declarations: [
    HomePage,
    Chats,
	Groups,
	Location
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage,
    Chats,
	Groups,
	Location
  ]
})
export class HomeModule {}
