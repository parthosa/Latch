import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Latch } from './app.component';

import { LandingPage } from '../pages/landing/landing';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { RegisterPage } from '../pages/register/register';
import { OtpPage } from '../pages/otp/otp';
import { MobileNumPage } from '../pages/mobile-num/mobile-num';

import { InterestsPage } from '../pages/interests/interests';
import { UploadPicPage } from '../pages/upload-pic/upload-pic';
import { IndiChatPage } from '../pages/indi-chat/indi-chat';
import { GroupChatPage } from '../pages/group-chat/group-chat';
import { Chats } from '../components/chats/chats';
import { Groups } from '../components/groups/groups';
import { Location } from '../components/location/location';

import { HttpService } from '../providers/http-service';
import { GlobalVariables } from '../providers/global-variables';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    Latch,
    LandingPage,
    HomePage,
    SignInPage,
    RegisterPage,
    MobileNumPage,
    OtpPage,
    InterestsPage,
    UploadPicPage,
    IndiChatPage,
    GroupChatPage,
     Chats,
    Groups,
    Location,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(Latch),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Latch,
    LandingPage,
    HomePage,
    SignInPage,
    RegisterPage,
    MobileNumPage,
    OtpPage,
    InterestsPage,
    UploadPicPage,
    IndiChatPage,
    GroupChatPage,
     Chats,
    Groups,
    Location,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileTransferObject,
    File,
    Geolocation,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpModule,
    HttpService,
    GlobalVariables
  ]
})
export class AppModule {}
