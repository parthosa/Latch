import { Component } from '@angular/core';
// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { App,Platform,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from '../pages/landing/landing';
import { SosPage } from '../pages/sos/sos';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class Latch {
  rootPage:any = LandingPage;
  app:App;
  isAnonymous:boolean;

  constructor(app:App,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private push: Push,public menuCtrl: MenuController,public storage: Storage) {
    this.isAnonymous = false;
    this.app = app;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menuCtrl.enable(false);
      // this.initPush();
    });

   
  }

  initPush(){

    this.push.hasPermission()
  .then((res: any) => {

    if (res.isEnabled) {
      console.log('We have permission to send push notifications');
    } else {
      console.log('We do not have permission to send push notifications');
    }

  });

        const options: PushOptions = {
       android: {
           senderID: '1082407628646'
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
       windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }

  logout(){
    console.log(this.storage.length());
    this.storage.clear()
    .then((res:any)=>{
      console.log(this.storage.length());
      this.app.getActiveNav().popToRoot();
    });
  }

  goToAddSos(){
    this.app.getActiveNav().push(SosPage);
  }

  updateAnonymous(){
    // bla
  }
}
