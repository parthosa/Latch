import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Latch } from './app.component';

import { LandingPage } from '../pages/landing/landing';
import { RegisterPage } from '../pages/register/register';
import { UploadPicPage } from '../pages/upload-pic/upload-pic';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    Latch,
    LandingPage,
    RegisterPage,
    UploadPicPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Latch)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Latch,
    LandingPage,
    RegisterPage,
    UploadPicPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileTransferObject,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
