import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndiChatPage } from './indi-chat';

@NgModule({
  declarations: [
    IndiChatPage,
  ],
  imports: [
    IonicPageModule.forChild(IndiChatPage),
  ],
  exports: [
    IndiChatPage
  ]
})
export class IndiChatModule {}
