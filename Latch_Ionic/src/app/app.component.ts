import { Component } from '@angular/core';
import { Platform,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from '../pages/landing/landing';

@Component({
  templateUrl: 'app.html'
})
export class Latch {
  rootPage:any = LandingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menuCtrl.enable(false);

    });
  }
}
