import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Interests } from './interests';

@NgModule({
  declarations: [
    Interests,
  ],
  imports: [
    IonicPageModule.forChild(Interests),
  ],
  exports: [
    Interests
  ]
})
export class InterestsModule {}
